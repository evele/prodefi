// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import {Script} from "forge-std/Script.sol";

contract CounterScript is Script {
    function setUp() public {}

    function run() public pure {
        revert("Counter script removed; use script/Deploy.s.sol");
    }
}
