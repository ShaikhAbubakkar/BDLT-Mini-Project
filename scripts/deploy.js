const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Starting smart contract deployment...\n");

  try {
    // Get signer
    const [deployer] = await hre.ethers.getSigners();
    const deployerAddress = await deployer.getAddress();

    console.log(`Deploying contracts with account: ${deployerAddress}`);
    console.log(`Account balance: ${await deployer.provider.getBalance(deployerAddress)}`);

    // Deploy LandRegistry
    console.log("\n1. Deploying LandRegistry contract...");
    const LandRegistry = await hre.ethers.getContractFactory("LandRegistry");
    const landRegistry = await LandRegistry.deploy();
    await landRegistry.deployed();
    console.log(`LandRegistry deployed to: ${landRegistry.address}`);

    // Deploy LandTransfer
    console.log("\n2. Deploying LandTransfer contract...");
    const LandTransfer = await hre.ethers.getContractFactory("LandTransfer");
    const landTransfer = await LandTransfer.deploy(landRegistry.address);
    await landTransfer.deployed();
    console.log(`LandTransfer deployed to: ${landTransfer.address}`);

    // Save deployment info
    const deploymentInfo = {
      network: hre.network.name,
      deployer: deployerAddress,
      deploymentTime: new Date().toISOString(),
      contracts: {
        LandRegistry: {
          address: landRegistry.address,
          blockNumber: landRegistry.deployTransaction.blockNumber,
        },
        LandTransfer: {
          address: landTransfer.address,
          blockNumber: landTransfer.deployTransaction.blockNumber,
        },
      },
    };

    // Save to deployment file
    const deploymentsDir = path.join(__dirname, "../deployments");
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir, { recursive: true });
    }

    const deploymentFile = path.join(
      deploymentsDir,
      `${hre.network.name}-deployment.json`
    );
    fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
    console.log(`\nDeployment info saved to: ${deploymentFile}`);

    // Save to .env for frontend
    const envContent = `REACT_APP_LAND_REGISTRY_ADDRESS=${landRegistry.address}
REACT_APP_LAND_TRANSFER_ADDRESS=${landTransfer.address}
REACT_APP_NETWORK_ID=${hre.network.config.chainId}`;

    const envFile = path.join(__dirname, "../frontend/.env.local");
    fs.writeFileSync(envFile, envContent);
    console.log(`Frontend .env.local updated: ${envFile}`);

    // Skip verification on localhost and hardhat
    if (hre.network.name === "mumbai") {
      console.log("\nVerifying contracts on PolygonScan (takes 1-2 min)...");
      try {
        await new Promise((resolve) => setTimeout(resolve, 5000));

        await hre.run("verify:verify", {
          address: landRegistry.address,
          constructorArguments: [],
        });
        console.log("LandRegistry verified");

        await hre.run("verify:verify", {
          address: landTransfer.address,
          constructorArguments: [landRegistry.address],
        });
        console.log("LandTransfer verified");
      } catch (err) {
        console.log("Verification may still be processing - check PolygonScan");
      }
    }

    console.log("\n=== Deployment Summary ===");
    console.log(`Network: ${hre.network.name}`);
    console.log(`LandRegistry: ${landRegistry.address}`);
    console.log(`LandTransfer: ${landTransfer.address}`);
    console.log("=========================\n");

  } catch (error) {
    console.error("Deployment failed:", error);
    process.exitCode = 1;
  }
}

main();
