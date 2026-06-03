// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import { Script, console } from "forge-std/Script.sol";
import { Carton } from "../src/Carton.sol";
import { Predictions } from "../src/Predictions.sol";
import { Treasury } from "../src/Treasury.sol";

contract DeployMainnetScript is Script {
    error MissingDeployer();
    error MissingMinter();
    error MissingUsdc();
    error InvalidTournamentId();

    function run() public {
        uint256 deployerPrivateKey = vm.envOr("PRIVATE_KEY", uint256(0));
        bytes32 teamsHash = vm.envOr("TEAMS_HASH", bytes32(0));
        address minter = vm.envOr("MINTER_ADDRESS", address(0));
        address usdc = vm.envOr("USDC_ADDRESS", address(0));
        uint256 tournamentId = vm.envOr("TOURNAMENT_ID", uint256(1));
        uint256 tokenPriceUsdc = vm.envOr("TOKEN_PRICE_USDC", uint256(10 ** 6));
        uint256 reserveBps = vm.envOr("RESERVE_BPS", uint256(500));
        uint256 emergencyDelay = vm.envOr("EMERGENCY_DELAY", uint256(60 days));

        if (minter == address(0)) revert MissingMinter();
        if (usdc == address(0)) revert MissingUsdc();
        if (tournamentId == 0) revert InvalidTournamentId();

        address deployer;
        if (deployerPrivateKey != 0) {
            deployer = vm.addr(deployerPrivateKey);
            vm.startBroadcast(deployerPrivateKey);
        } else {
            deployer = vm.envOr("DEPLOYER_ADDRESS", address(0));
            if (deployer == address(0)) revert MissingDeployer();
            vm.startBroadcast();
        }

        console.log("Deploying mainnet contracts...");
        console.log("Deployer address:", deployer);
        console.log("Minter address:", minter);
        console.log("USDC token:", usdc);

        Carton carton = new Carton(deployer, deployer, minter);
        console.log("Carton deployed at:", address(carton));

        Predictions predictions = new Predictions(address(carton), tournamentId);
        console.log("Predictions deployed at:", address(predictions));
        if (teamsHash != bytes32(0)) {
            predictions.setTeamsHash(teamsHash);
            console.log("Teams hash set:", uint256(teamsHash));
        }

        Treasury treasury = new Treasury(deployer, address(carton), uint16(reserveBps), emergencyDelay);
        console.log("Treasury deployed at:", address(treasury));

        console.log("\nConfiguring production token support...");
        treasury.setSupportedPrizeToken(usdc, true);
        carton.setAcceptedToken(usdc, true);
        console.log("USDC accepted with price:", tokenPriceUsdc);

        console.log("\nSetting up contracts...");
        carton.setTreasuryAddress(address(treasury));
        treasury.registerTournament(tournamentId, address(predictions));
        carton.setActiveTournament(tournamentId);
        carton.setTokenPrice(tournamentId, usdc, tokenPriceUsdc);
        console.log("Carton configured with Treasury and active tournament:", tournamentId);

        treasury.grantRole(treasury.FUND_DEPOSITOR_ROLE(), address(carton));
        console.log("Carton granted FUND_DEPOSITOR_ROLE on Treasury");

        treasury.grantRole(treasury.TOURNAMENT_MANAGER_ROLE(), deployer);
        console.log("Deployer granted TOURNAMENT_MANAGER_ROLE on Treasury");

        vm.stopBroadcast();

        console.log("\n=== MAINNET DEPLOYMENT COMPLETE ===");
        console.log("Carton:     ", address(carton));
        console.log("Predictions:", address(predictions));
        console.log("Treasury:   ", address(treasury));
        console.log("USDC:       ", usdc);
    }
}
