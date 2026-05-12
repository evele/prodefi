// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.27;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {ERC1155Burnable} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import {ERC1155Pausable} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Pausable.sol";
import {ERC1155Supply} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface ITreasury {
    function depositFromSales(uint256 tournamentId) external payable;
    function depositFromSalesERC20(uint256 tournamentId, address token, uint256 amount) external;
    function salesClosed(uint256 tournamentId) external view returns (bool);
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
    error NoFundsToWithdraw();
    error WithdrawFailed();
    error NoTokensToWithdraw();
    error ZeroTreasuryAddress();
    error ZeroTournamentId();
    error TournamentSalesClosed();

    bytes32 public constant URI_SETTER_ROLE = keccak256("URI_SETTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    uint256 public cartonPrice;
    uint256 private _nextTokenId = 1;

    mapping(address => bool) public acceptedTokens;
    mapping(address => uint256) public tokenPrices;
    mapping(uint256 => uint256) public tokenTournamentId;

    mapping(address => uint256[]) private userTokens;

    ITreasury public treasury;
    uint256 public activeTournamentId;

    function nextTokenId() external view returns (uint256) {
        return _nextTokenId;
    }

    event CartonPurchased(address indexed buyer, uint256 indexed tokenId, uint256 price);
    event CartonPurchasedWithToken(
        address indexed buyer, uint256 indexed tokenId, address indexed token, uint256 price
    );
    event PriceUpdated(uint256 oldPrice, uint256 newPrice);

    constructor(address defaultAdmin, address pauser, address minter) ERC1155("") {
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(PAUSER_ROLE, pauser);
        _grantRole(MINTER_ROLE, minter);
    }

    function setURI(string memory newuri) public onlyRole(URI_SETTER_ROLE) {
        _setURI(newuri);
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function mint(address account, uint256 amount, bytes memory data) public onlyRole(MINTER_ROLE) returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        tokenTournamentId[tokenId] = activeTournamentId;
        _mint(account, tokenId, amount, data);
        return tokenId;
    }

    function mintBatch(address to, uint256[] memory amounts, bytes memory data)
        public
        onlyRole(MINTER_ROLE)
        returns (uint256[] memory)
    {
        uint256[] memory ids = new uint256[](amounts.length);
        for (uint256 i = 0; i < amounts.length; i++) {
            ids[i] = _nextTokenId++;
            tokenTournamentId[ids[i]] = activeTournamentId;
        }
        _mintBatch(to, ids, amounts, data);
        return ids;
    }

    function buyCarton() external payable {
        revert EthPurchaseDisabled();
    }

    function buyCartonWithToken(address token) external whenNotPaused nonReentrant {
        if (!acceptedTokens[token]) revert TokenNotAccepted();
        if (tokenPrices[token] == 0) revert TokenPriceNotSet();
        ITreasury _treasury = treasury;
        uint256 _tournamentId = activeTournamentId;
        if (address(_treasury) != address(0) && _tournamentId > 0 && _treasury.salesClosed(_tournamentId)) {
            revert TournamentSalesClosed();
        }

        uint256 amount = tokenPrices[token];
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);

        uint256 tokenId = _nextTokenId++;
        tokenTournamentId[tokenId] = _tournamentId;
        _mint(msg.sender, tokenId, 1, "");

        emit CartonPurchasedWithToken(msg.sender, tokenId, token, amount);

        // Auto-deposit to Treasury if configured
        if (address(_treasury) != address(0) && _tournamentId > 0) {
            IERC20(token).approve(address(_treasury), amount);
            _treasury.depositFromSalesERC20(_tournamentId, token, amount);
        }
    }

    function setAcceptedToken(address token, bool accepted) external onlyRole(DEFAULT_ADMIN_ROLE) {
        acceptedTokens[token] = accepted;
    }

    function setTokenPrice(address token, uint256 price) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (price == 0) revert PriceMustBePositive();
        tokenPrices[token] = price;
    }

    function setCartonPrice(uint256 newPrice) external onlyRole(DEFAULT_ADMIN_ROLE) {
        uint256 oldPrice = cartonPrice;
        cartonPrice = newPrice;
        emit PriceUpdated(oldPrice, newPrice);
    }

    function withdraw() external onlyRole(DEFAULT_ADMIN_ROLE) nonReentrant {
        uint256 balance = address(this).balance;
        if (balance == 0) revert NoFundsToWithdraw();
        (bool ok,) = payable(msg.sender).call{value: balance}("");
        if (!ok) revert WithdrawFailed();
    }

    function withdrawToken(address token) external onlyRole(DEFAULT_ADMIN_ROLE) nonReentrant {
        uint256 balance = IERC20(token).balanceOf(address(this));
        if (balance == 0) revert NoTokensToWithdraw();
        IERC20(token).safeTransfer(msg.sender, balance);
    }

    function setTreasuryAddress(address treasuryAddress) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (treasuryAddress == address(0)) revert ZeroTreasuryAddress();
        treasury = ITreasury(treasuryAddress);
    }

    function setActiveTournament(uint256 tournamentId) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (tournamentId == 0) revert ZeroTournamentId();
        activeTournamentId = tournamentId;
    }

    function getUserTokens(address user) external view returns (uint256[] memory) {
        return userTokens[user];
    }

    function _addTokenToUser(address user, uint256 tokenId) internal {
        userTokens[user].push(tokenId);
    }

    function _removeTokenFromUser(address user, uint256 tokenId) internal {
        uint256[] memory tokens = userTokens[user];
        for (uint256 i = 0; i < tokens.length; i++) {
            if (tokens[i] == tokenId) {
                userTokens[user][i] = tokens[tokens.length - 1];
                userTokens[user].pop();
                break;
            }
        }
    }

    // The following functions are overrides required by Solidity.

    function _update(address from, address to, uint256[] memory ids, uint256[] memory values)
        internal
        override(ERC1155, ERC1155Pausable, ERC1155Supply)
    {
        super._update(from, to, ids, values);
        if (from == address(0)) {
            for (uint256 i = 0; i < ids.length; i++) {
                _addTokenToUser(to, ids[i]);
            }
            return;
        }
        if (to == address(0)) {
            for (uint256 i = 0; i < ids.length; i++) {
                _removeTokenFromUser(from, ids[i]);
            }
            return;
        }
        if (from != address(0) && to != address(0)) {
            for (uint256 i = 0; i < ids.length; i++) {
                _removeTokenFromUser(from, ids[i]);
                _addTokenToUser(to, ids[i]);
            }
            return;
        }
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
