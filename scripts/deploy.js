const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contract with wallet:", deployer.address);

  const initialSupply = 1000000;
  console.log("Initial supply:", initialSupply);

  const SimpleToken = await ethers.getContractFactory("SimpleToken");
  const token = await SimpleToken.deploy(initialSupply);

  // ✅ THIS is the updated syntax for ethers v6+
  await token.waitForDeployment();

  console.log("✅ SimpleToken deployed at:", token.target);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exit(1);
});
