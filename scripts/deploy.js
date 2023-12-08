const { ethers } = require("hardhat");

async function main() {

  // Get the contract owner
  const contractOwner = await ethers.getSigners();
  console.log(`Deploying contract from: ${contractOwner[0].address}`);

  // Hardhat helper to get the ethers contractFactory object
  const TestErcToken = await ethers.getContractFactory('TestErcToken');

  // Deploy the contract
  console.log('Deploying TestErcToken...');
  const testErcToken = await TestErcToken.deploy();
  await testErcToken.deployed();
  console.log("TestErcToken deployed to", await testErcToken.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

  //0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9 - smart contract address