// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.27;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {ERC1155Burnable} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import {ERC1155Pausable} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Pausable.sol";
import {ERC1155Supply} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

/// @custom:security-contact inux2012@gmail.com
contract Carton is ERC1155, AccessControl, ERC1155Pausable, ERC1155Burnable, ERC1155Supply {
    bytes32 public constant URI_SETTER_ROLE = keccak256("URI_SETTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    uint256 public cartonPrice;
    uint256 private _nextTokenId = 1;

    mapping(address => uint256[]) private userTokens;

    event CartonPurchased(address indexed buyer, uint256 indexed tokenId, uint256 price);
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
        }
        _mintBatch(to, ids, amounts, data);
        return ids;
    }

    function buyCarton() external payable whenNotPaused {
        require(cartonPrice > 0, "Price not set");
        require(msg.value >= cartonPrice, "Insufficient payment");

        uint256 tokenId = _nextTokenId++;
        _mint(msg.sender, tokenId, 1, "");
        // userTokens[msg.sender].push(tokenId);

        emit CartonPurchased(msg.sender, tokenId, msg.value);

        if (msg.value > cartonPrice) {
            payable(msg.sender).transfer(msg.value - cartonPrice);
        }
    }

    function setCartonPrice(uint256 newPrice) external onlyRole(DEFAULT_ADMIN_ROLE) {
        uint256 oldPrice = cartonPrice;
        cartonPrice = newPrice;
        emit PriceUpdated(oldPrice, newPrice);
    }

    function withdraw() external onlyRole(DEFAULT_ADMIN_ROLE) {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(msg.sender).transfer(balance);
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
