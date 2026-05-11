// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {Script, console} from "forge-std/Script.sol";
import {Carton} from "../src/Carton.sol";
import {Predictions} from "../src/Predictions.sol";
import {Treasury} from "../src/Treasury.sol";
import {MockERC20} from "../src/mocks/MockERC20.sol";

contract DeployScript is Script {
    function run() public {
        // Usar la primera cuenta de Anvil como deployer
        uint256 deployerPrivateKey =
            vm.envOr("PRIVATE_KEY", uint256(0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80));
        // Hash ancla para los equipos (off-chain metadata). Suministrado por env o 0x0 por defecto
        bytes32 teamsHash = vm.envOr("TEAMS_HASH", bytes32(0));

        vm.startBroadcast(deployerPrivateKey);

        console.log("Deploying contracts...");
        console.log("Deployer address:", vm.addr(deployerPrivateKey));

        address deployer = vm.addr(deployerPrivateKey);

        // Deploy Carton (ERC1155) - necesita 3 parámetros: admin, pauser, minter
        Carton carton = new Carton(deployer, deployer, deployer);
        console.log("Carton deployed at:", address(carton));

        // Deploy Predictions - ahora solo address del carton; teamsHash via setter si aplica
        Predictions predictions = new Predictions(address(carton));
        console.log("Predictions deployed at:", address(predictions));
        if (teamsHash != bytes32(0)) {
            predictions.setTeamsHash(teamsHash);
            console.log("Teams hash set:", uint256(teamsHash));
        }

        // Deploy Treasury - necesita 3 parámetros: admin, carton, predictions
        Treasury treasury = new Treasury(deployer, address(carton), address(predictions), 500);
        console.log("Treasury deployed at:", address(treasury));

        // Deploy MockUSDC (6 decimals like real USDC)
        console.log("\nDeploying MockUSDC...");
        MockERC20 usdc = new MockERC20("USD Coin", "USDC", 6);
        console.log("MockUSDC deployed at:", address(usdc));

        // Configure USDC in Carton
        console.log("\nConfiguring USDC support...");
        carton.setAcceptedToken(address(usdc), true);
        carton.setTokenPrice(address(usdc), 10 ** 6); // 1 USDC = 10^6
        console.log("USDC accepted with price: 1 USDC");

        // Setup inicial
        console.log("\nSetting up contracts...");

        uint256 tournamentId = 1; // Primer torneo

        // Configure Treasury integration
        carton.setTreasuryAddress(address(treasury));
        carton.setActiveTournament(tournamentId);
        console.log("Carton configured with Treasury and active tournament:", tournamentId);

        // Grant FUND_DEPOSITOR_ROLE to Carton contract
        treasury.grantRole(treasury.FUND_DEPOSITOR_ROLE(), address(carton));
        console.log("Carton granted FUND_DEPOSITOR_ROLE on Treasury");

        // Grant TOURNAMENT_MANAGER_ROLE to deployer
        treasury.grantRole(treasury.TOURNAMENT_MANAGER_ROLE(), deployer);
        console.log("Deployer granted TOURNAMENT_MANAGER_ROLE on Treasury");

        // Prize distribution is now configured only after sales close.
        // Keep the fixed 32-place vector here as the deployment-time reference for the admin flow.
        uint8[] memory distribution = new uint8[](32);
        distribution[0] = 22;
        distribution[1] = 14;
        distribution[2] = 9;
        distribution[3] = 7;
        distribution[4] = 4;
        distribution[5] = 4;
        distribution[6] = 4;
        distribution[7] = 4;
        distribution[8] = 2;
        distribution[9] = 2;
        distribution[10] = 2;
        distribution[11] = 2;
        distribution[12] = 2;
        distribution[13] = 2;
        distribution[14] = 2;
        distribution[15] = 2;
        distribution[16] = 1;
        distribution[17] = 1;
        distribution[18] = 1;
        distribution[19] = 1;
        distribution[20] = 1;
        distribution[21] = 1;
        distribution[22] = 1;
        distribution[23] = 1;
        distribution[24] = 1;
        distribution[25] = 1;
        distribution[26] = 1;
        distribution[27] = 1;
        distribution[28] = 1;
        distribution[29] = 1;
        distribution[30] = 1;
        distribution[31] = 1;
        console.log("Fixed payout places configured for admin reference:", distribution.length);

        // Mint USDC to deployer for testing purchases
        usdc.mint(deployer, 1000 * 10 ** 6);
        console.log("Minted 1000 USDC to deployer");

        vm.stopBroadcast();

        console.log("\n=== DEPLOYMENT COMPLETE ===");
        console.log("Carton:     ", address(carton));
        console.log("Predictions:", address(predictions));
        console.log("Treasury:   ", address(treasury));
        console.log("\nCopy these addresses to your frontend!");
    }
}
