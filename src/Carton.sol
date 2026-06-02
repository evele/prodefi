// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity 0.8.27;

import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";
import { ERC1155 } from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import { ERC1155Pausable } from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Pausable.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import { CartonSalesConfig } from "./CartonSalesConfig.sol";

interface ITreasury {
    function depositFromSalesERC20(uint256 tournamentId, address token, uint256 amount) external;
    function isSupportedPrizeToken(address token) external view returns (bool);
    function salesClosed(uint256 tournamentId) external view returns (bool);
    function isTournamentRegistered(uint256 tournamentId) external view returns (bool);
}

/// @custom:security-contact inux2012@gmail.com
contract Carton is ERC1155, AccessControl, ERC1155Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    error TokenNotAccepted();
    error TokenPriceNotSet();
    error PriceMustBePositive();
    error ActiveTournamentNotSet();
    error NoFundsToWithdraw();
    error WithdrawFailed();
    error NoTokensToWithdraw();
    error ZeroTreasuryAddress();
    error TreasuryAddressNotContract();
    error InvalidTreasuryContract();
    error ZeroTournamentId();
    error ZeroTokenAddress();
    error CartonAmountMustBeOne();
    error TournamentSalesClosed();
    error TournamentNotRegistered();
    error UnsupportedPrizeToken();

    bytes32 public constant URI_SETTER_ROLE = keccak256("URI_SETTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    uint256 private _nextTokenId = 1;
    uint16 public metadataVariantCount;

    mapping(uint256 => uint256) public mintedByTournament;
    mapping(uint256 => uint256) public tokenTournamentId;
    mapping(uint256 => uint16) public variantByTokenId;

    mapping(address => uint256[]) private userTokens;
    mapping(address => mapping(uint256 => uint256)) private userTokenIndexPlusOne;

    CartonSalesConfig private immutable SALES_CONFIG;

    event CartonPurchasedWithToken(
        address indexed buyer, uint256 indexed tokenId, address indexed token, uint256 price
    );
    event URIUpdated(string oldURI, string newURI);
    event TokenPriceUpdated(uint256 indexed tournamentId, address indexed token, uint256 oldPrice, uint256 newPrice);
    event ActiveTournamentChanged(uint256 indexed oldTournamentId, uint256 indexed newTournamentId);
    event AcceptedTokenSet(address indexed token, bool accepted);
    event TreasuryAddressChanged(address indexed oldTreasury, address indexed newTreasury);
    event RescueETHWithdrawn(address indexed recipient, uint256 amount);
    event RescueTokenWithdrawn(address indexed recipient, address indexed token, uint256 amount);

    constructor(address defaultAdmin, address pauser, address minter) ERC1155("") {
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(PAUSER_ROLE, pauser);
        _grantRole(MINTER_ROLE, minter);
        SALES_CONFIG = new CartonSalesConfig(address(this));
    }

    function nextTokenId() external view returns (uint256) {
        return _nextTokenId;
    }

    function acceptedTokens(address token) external view returns (bool) {
        return SALES_CONFIG.acceptedTokens(token);
    }

    function tokenPricesByTournament(uint256 tournamentId, address token) external view returns (uint256) {
        return SALES_CONFIG.tokenPricesByTournament(tournamentId, token);
    }

    function treasury() public view returns (ITreasury) {
        return ITreasury(SALES_CONFIG.treasury());
    }

    function activeTournamentId() public view returns (uint256) {
        return SALES_CONFIG.activeTournamentId();
    }

    function setURI(string memory newuri) public onlyRole(URI_SETTER_ROLE) {
        string memory oldURI = uri(0);
        _setURI(newuri);
        emit URIUpdated(oldURI, newuri);
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function mint(address account, uint256 amount, bytes memory data) public onlyRole(MINTER_ROLE) returns (uint256) {
        return mintForTournament(account, SALES_CONFIG.activeTournamentId(), amount, data);
    }

    function mintForTournament(address account, uint256 tournamentId, uint256 amount, bytes memory data)
        public
        onlyRole(MINTER_ROLE)
        returns (uint256)
    {
        _validateTournamentSelection(tournamentId);
        if (amount != 1) revert CartonAmountMustBeOne();

        uint256 tokenId = _nextTokenId++;
        mintedByTournament[tournamentId] += 1;
        tokenTournamentId[tokenId] = tournamentId;
        _assignVariant(tokenId, account, tournamentId);
        _mint(account, tokenId, amount, data);
        return tokenId;
    }

    function mintBatch(address to, uint256[] memory amounts, bytes memory data)
        public
        onlyRole(MINTER_ROLE)
        returns (uint256[] memory)
    {
        return mintBatchForTournament(to, SALES_CONFIG.activeTournamentId(), amounts, data);
    }

    function mintBatchForTournament(address to, uint256 tournamentId, uint256[] memory amounts, bytes memory data)
        public
        onlyRole(MINTER_ROLE)
        returns (uint256[] memory)
    {
        _validateTournamentSelection(tournamentId);

        uint256 amountsLength = amounts.length;
        mintedByTournament[tournamentId] += amountsLength;
        uint256[] memory ids = new uint256[](amountsLength);
        for (uint256 i; i < amountsLength;) {
            if (amounts[i] != 1) revert CartonAmountMustBeOne();
            ids[i] = _nextTokenId++;
            tokenTournamentId[ids[i]] = tournamentId;
            _assignVariant(ids[i], to, tournamentId);
            unchecked {
                ++i;
            }
        }
        _mintBatch(to, ids, amounts, data);
        return ids;
    }

    function buyCartonWithToken(address token) external whenNotPaused nonReentrant {
        _buyCartonWithToken(SALES_CONFIG.activeTournamentId(), token);
    }

    function buyCartonWithToken(uint256 tournamentId, address token) public whenNotPaused nonReentrant {
        _buyCartonWithToken(tournamentId, token);
    }

    function _buyCartonWithToken(uint256 tournamentId, address token) internal {
        (uint256 amount, address treasuryAddress) = SALES_CONFIG.getPurchaseContext(tournamentId, token);

        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);

        uint256 tokenId = _nextTokenId++;
        mintedByTournament[tournamentId] += 1;
        tokenTournamentId[tokenId] = tournamentId;
        _assignVariant(tokenId, msg.sender, tournamentId);
        _mint(msg.sender, tokenId, 1, "");

        emit CartonPurchasedWithToken(msg.sender, tokenId, token, amount);

        if (treasuryAddress != address(0)) {
            IERC20(token).forceApprove(treasuryAddress, amount);
            ITreasury(treasuryAddress).depositFromSalesERC20(tournamentId, token, amount);
        }
    }

    function setAcceptedToken(address token, bool accepted) external onlyRole(DEFAULT_ADMIN_ROLE) {
        SALES_CONFIG.setAcceptedToken(token, accepted);
        emit AcceptedTokenSet(token, accepted);
    }

    function setTokenPrice(address token, uint256 price) external onlyRole(DEFAULT_ADMIN_ROLE) {
        uint256 tournamentId = SALES_CONFIG.activeTournamentId();
        if (tournamentId == 0) revert ActiveTournamentNotSet();
        _setTokenPrice(tournamentId, token, price);
    }

    function setTokenPrice(uint256 tournamentId, address token, uint256 price) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _setTokenPrice(tournamentId, token, price);
    }

    function _setTokenPrice(uint256 tournamentId, address token, uint256 price) internal {
        uint256 oldPrice = SALES_CONFIG.tokenPricesByTournament(tournamentId, token);
        SALES_CONFIG.setTokenPrice(tournamentId, token, price);
        emit TokenPriceUpdated(tournamentId, token, oldPrice, price);
    }

    function setMetadataVariantCount(uint16 count) external onlyRole(DEFAULT_ADMIN_ROLE) {
        metadataVariantCount = count;
    }

    function tokenPrices(address token) external view returns (uint256) {
        return SALES_CONFIG.tokenPrices(token);
    }

    function withdraw() external onlyRole(DEFAULT_ADMIN_ROLE) nonReentrant {
        uint256 balance = address(this).balance;
        if (balance == 0) revert NoFundsToWithdraw();
        (bool ok,) = payable(msg.sender).call{ value: balance }("");
        if (!ok) revert WithdrawFailed();
        emit RescueETHWithdrawn(msg.sender, balance);
    }

    function withdrawToken(address token) external onlyRole(DEFAULT_ADMIN_ROLE) nonReentrant {
        uint256 balance = IERC20(token).balanceOf(address(this));
        if (balance == 0) revert NoTokensToWithdraw();
        IERC20(token).safeTransfer(msg.sender, balance);
        emit RescueTokenWithdrawn(msg.sender, token, balance);
    }

    function setTreasuryAddress(address treasuryAddress) external onlyRole(DEFAULT_ADMIN_ROLE) {
        address previousTreasury = SALES_CONFIG.treasury();
        SALES_CONFIG.setTreasuryAddress(treasuryAddress);
        emit TreasuryAddressChanged(previousTreasury, treasuryAddress);
    }

    function setActiveTournament(uint256 tournamentId) external onlyRole(DEFAULT_ADMIN_ROLE) {
        uint256 oldTournamentId = SALES_CONFIG.activeTournamentId();
        SALES_CONFIG.setActiveTournament(tournamentId);
        emit ActiveTournamentChanged(oldTournamentId, tournamentId);
    }

    function _validateTournamentSelection(uint256 tournamentId) internal view {
        SALES_CONFIG.validateTournamentSelection(tournamentId);
    }

    function _assignVariant(uint256 tokenId, address account, uint256 tournamentId) internal {
        uint16 count = metadataVariantCount;
        if (count == 0) return;

        variantByTokenId[tokenId] = uint16(
            (uint256(keccak256(abi.encodePacked(block.prevrandao, tokenId, account, tournamentId))) % count) + 1
        );
    }

    function getUserTokens(address user) external view returns (uint256[] memory) {
        return userTokens[user];
    }

    function _addTokenToUser(address user, uint256 tokenId) internal {
        if (userTokenIndexPlusOne[user][tokenId] != 0) return;

        userTokens[user].push(tokenId);
        userTokenIndexPlusOne[user][tokenId] = userTokens[user].length;
    }

    function _removeTokenFromUser(address user, uint256 tokenId) internal {
        uint256 indexPlusOne = userTokenIndexPlusOne[user][tokenId];
        if (indexPlusOne == 0) return;

        uint256 index = indexPlusOne - 1;
        uint256 lastIndex = userTokens[user].length - 1;

        if (index != lastIndex) {
            uint256 lastTokenId = userTokens[user][lastIndex];
            userTokens[user][index] = lastTokenId;
            userTokenIndexPlusOne[user][lastTokenId] = index + 1;
        }

        userTokens[user].pop();
        delete userTokenIndexPlusOne[user][tokenId];
    }

    function _update(address from, address to, uint256[] memory ids, uint256[] memory values)
        internal
        override(ERC1155, ERC1155Pausable)
    {
        super._update(from, to, ids, values);
        uint256 idsLength = ids.length;
        for (uint256 i; i < idsLength;) {
            if (from != address(0)) _removeTokenFromUser(from, ids[i]);
            if (to != address(0)) _addTokenToUser(to, ids[i]);
            unchecked {
                ++i;
            }
        }
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
