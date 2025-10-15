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
        Treasury treasury = new Treasury(deployer, address(carton), address(predictions));
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

        // Set precio del carton (0.1 ETH)
        carton.setCartonPrice(0.1 ether);
        console.log("Carton price set to 0.1 ETH");

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

        // Configurar distribución de premios en Treasury para torneo 1 (50%, 30%, 15%, 5%)
        uint8[] memory distribution = new uint8[](4);
        distribution[0] = 50; // 1st place
        distribution[1] = 30; // 2nd place
        distribution[2] = 15; // 3rd place
        distribution[3] = 5; // 4th place
        treasury.setPrizeDistribution(tournamentId, address(0), distribution); // address(0) = ETH
        console.log("Prize distribution set for tournament 1: 50%, 30%, 15%, 5%");

        // Set USDC prize distribution (same as ETH)
        treasury.setPrizeDistribution(tournamentId, address(usdc), distribution);
        console.log("USDC prize distribution set for tournament 1: 50%, 30%, 15%, 5%");

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
