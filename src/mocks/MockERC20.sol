// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    address internal constant ANVIL_ACCOUNT_1 = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;
    address internal constant ANVIL_ACCOUNT_2 = 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC;

    uint8 private _decimals;

    constructor(string memory name_, string memory symbol_, uint8 decimals_) ERC20(name_, symbol_) {
        uint256 initialAmount = 1_000_000 * 10 ** decimals_;

        _decimals = decimals_;
        _mint(msg.sender, initialAmount);
        _mint(ANVIL_ACCOUNT_1, initialAmount);
        _mint(ANVIL_ACCOUNT_2, initialAmount);
    }

    function decimals() public view override returns (uint8) {
        return _decimals;
    }

    // Mint libre para tests
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
