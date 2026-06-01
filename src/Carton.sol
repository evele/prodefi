// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity 0.8.27;

import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";
import { ERC1155 } from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import { ERC1155Burnable } from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import { ERC1155Pausable } from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Pausable.sol";
import { ERC1155Supply } from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface ITreasury {
    function depositFromSales(uint256 tournamentId) external payable;
    function depositFromSalesERC20(uint256 tournamentId, address token, uint256 amount) external;
    function isSupportedPrizeToken(address token) external view returns (bool);
    function salesClosed(uint256 tournamentId) external view returns (bool);
    function isTournamentRegistered(uint256 tournamentId) external view returns (bool);
}

/// @custom:security-contact inux2012@gmail.com
contract Carton is ERC1155, AccessControl, ERC1155Pausable, ERC1155Burnable, ERC1155Supply, ReentrancyGuard {
    using SafeERC20 for IERC20;

    error PriceNotSet();
    error InsufficientPayment();
    error RefundFailed();
    error EthPurchaseDisabled();
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

    uint256 public cartonPrice;
    uint256 private _nextTokenId = 1;

    mapping(address => bool) public acceptedTokens;
    mapping(uint256 => mapping(address => uint256)) public tokenPricesByTournament;
    mapping(uint256 => uint256) public tokenTournamentId;

    mapping(address => uint256[]) private userTokens;
    mapping(address => mapping(uint256 => uint256)) private userTokenIndexPlusOne;

    ITreasury public treasury;
    uint256 public activeTournamentId;

    function nextTokenId() external view returns (uint256) {
        return _nextTokenId;
    }

    event CartonPurchased(address indexed buyer, uint256 indexed tokenId, uint256 price);
    event CartonPurchasedWithToken(
        address indexed buyer, uint256 indexed tokenId, address indexed token, uint256 price
    );
    event URIUpdated(string oldURI, string newURI);
    event PriceUpdated(uint256 oldPrice, uint256 newPrice);
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
        return mintForTournament(account, activeTournamentId, amount, data);
    }

    function mintForTournament(address account, uint256 tournamentId, uint256 amount, bytes memory data)
        public
        onlyRole(MINTER_ROLE)
        returns (uint256)
    {
        _validateTournamentSelection(tournamentId);
        if (amount != 1) revert CartonAmountMustBeOne();

        uint256 tokenId = _nextTokenId++;
        tokenTournamentId[tokenId] = tournamentId;
        _mint(account, tokenId, amount, data);
        return tokenId;
    }

    function mintBatch(address to, uint256[] memory amounts, bytes memory data)
        public
        onlyRole(MINTER_ROLE)
        returns (uint256[] memory)
    {
        return mintBatchForTournament(to, activeTournamentId, amounts, data);
    }

    function mintBatchForTournament(address to, uint256 tournamentId, uint256[] memory amounts, bytes memory data)
        public
        onlyRole(MINTER_ROLE)
        returns (uint256[] memory)
    {
        _validateTournamentSelection(tournamentId);

        uint256 amountsLength = amounts.length;
        uint256[] memory ids = new uint256[](amountsLength);
        for (uint256 i; i < amountsLength;) {
            if (amounts[i] != 1) revert CartonAmountMustBeOne();
            ids[i] = _nextTokenId++;
            tokenTournamentId[ids[i]] = tournamentId;
            unchecked {
                ++i;
            }
        }
        _mintBatch(to, ids, amounts, data);
        return ids;
    }

    function buyCarton() external payable {
        revert EthPurchaseDisabled();
    }

    function buyCartonWithToken(address token) external whenNotPaused nonReentrant {
        _buyCartonWithToken(activeTournamentId, token);
    }

    function buyCartonWithToken(uint256 tournamentId, address token) public whenNotPaused nonReentrant {
        _buyCartonWithToken(tournamentId, token);
    }

    function _buyCartonWithToken(uint256 tournamentId, address token) internal {
        _validateTournamentSelection(tournamentId);

        if (!acceptedTokens[token]) revert TokenNotAccepted();
        uint256 amount = tokenPricesByTournament[tournamentId][token];
        if (amount == 0) revert TokenPriceNotSet();

        ITreasury _treasury = treasury;
        if (address(_treasury) != address(0)) {
            if (!_treasury.isSupportedPrizeToken(token)) revert UnsupportedPrizeToken();
            if (_treasury.salesClosed(tournamentId)) revert TournamentSalesClosed();
        }

        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);

        uint256 tokenId = _nextTokenId++;
        tokenTournamentId[tokenId] = tournamentId;
        _mint(msg.sender, tokenId, 1, "");

        emit CartonPurchasedWithToken(msg.sender, tokenId, token, amount);

        // Auto-deposit to Treasury if configured
        if (address(_treasury) != address(0)) {
            IERC20(token).forceApprove(address(_treasury), amount);
            _treasury.depositFromSalesERC20(tournamentId, token, amount);
        }
    }

    function setAcceptedToken(address token, bool accepted) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (token == address(0)) revert ZeroTokenAddress();

        ITreasury _treasury = treasury;
        if (accepted && address(_treasury) != address(0) && !_treasury.isSupportedPrizeToken(token)) {
            revert UnsupportedPrizeToken();
        }

        acceptedTokens[token] = accepted;
        emit AcceptedTokenSet(token, accepted);
    }

    function setTokenPrice(address token, uint256 price) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (activeTournamentId == 0) revert ActiveTournamentNotSet();
        setTokenPrice(activeTournamentId, token, price);
    }

    function setTokenPrice(uint256 tournamentId, address token, uint256 price) public onlyRole(DEFAULT_ADMIN_ROLE) {
        if (tournamentId == 0) revert ZeroTournamentId();
        if (price == 0) revert PriceMustBePositive();
        uint256 oldPrice = tokenPricesByTournament[tournamentId][token];
        tokenPricesByTournament[tournamentId][token] = price;
        emit TokenPriceUpdated(tournamentId, token, oldPrice, price);
    }

    function tokenPrices(address token) external view returns (uint256) {
        return tokenPricesByTournament[activeTournamentId][token];
    }

    function setCartonPrice(uint256 newPrice) external onlyRole(DEFAULT_ADMIN_ROLE) {
        uint256 oldPrice = cartonPrice;
        cartonPrice = newPrice;
        emit PriceUpdated(oldPrice, newPrice);
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
        if (treasuryAddress == address(0)) revert ZeroTreasuryAddress();

        if (treasuryAddress.code.length == 0) revert TreasuryAddressNotContract();

        (bool ok, bytes memory data) = treasuryAddress.staticcall(
            abi.encodeWithSelector(ITreasury.isTournamentRegistered.selector, 0)
        );
        if (!ok || data.length != 32) revert InvalidTreasuryContract();

        address previousTreasury = address(treasury);
        treasury = ITreasury(treasuryAddress);
        emit TreasuryAddressChanged(previousTreasury, treasuryAddress);
    }

    function setActiveTournament(uint256 tournamentId) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (tournamentId == 0) revert ZeroTournamentId();
        uint256 oldTournamentId = activeTournamentId;
        activeTournamentId = tournamentId;
        emit ActiveTournamentChanged(oldTournamentId, tournamentId);
    }

    function _validateTournamentSelection(uint256 tournamentId) internal view {
        if (tournamentId == 0) revert ZeroTournamentId();

        ITreasury _treasury = treasury;
        if (address(_treasury) != address(0) && !_treasury.isTournamentRegistered(tournamentId)) {
            revert TournamentNotRegistered();
        }
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

    // The following functions are overrides required by Solidity.

    function _update(address from, address to, uint256[] memory ids, uint256[] memory values)
        internal
        override(ERC1155, ERC1155Pausable, ERC1155Supply)
    {
        super._update(from, to, ids, values);
        uint256 idsLength = ids.length;
        if (from == address(0)) {
            for (uint256 i; i < idsLength;) {
                _addTokenToUser(to, ids[i]);
                unchecked {
                    ++i;
                }
            }
            return;
        }
        if (to == address(0)) {
            for (uint256 i; i < idsLength;) {
                _removeTokenFromUser(from, ids[i]);
                unchecked {
                    ++i;
                }
            }
            return;
        }
        if (from != address(0) && to != address(0)) {
            for (uint256 i; i < idsLength;) {
                _removeTokenFromUser(from, ids[i]);
                _addTokenToUser(to, ids[i]);
                unchecked {
                    ++i;
                }
            }
            return;
        }
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
