const { ethers } = require("hardhat")

async function main() {
  console.log("Deploying CredentialVault smart contracts...")

  // Get the contract factories
  const DIDRegistry = await ethers.getContractFactory("DIDRegistry")
  const CredentialRegistry = await ethers.getContractFactory("CredentialRegistry")
  const CredentialVerifier = await ethers.getContractFactory("CredentialVerifier")

  // Deploy DIDRegistry first
  console.log("Deploying DIDRegistry...")
  const didRegistry = await DIDRegistry.deploy()
  await didRegistry.waitForDeployment()
  const didRegistryAddress = await didRegistry.getAddress()
  console.log("DIDRegistry deployed to:", didRegistryAddress)

  // Deploy CredentialRegistry with DIDRegistry address
  console.log("Deploying CredentialRegistry...")
  const credentialRegistry = await CredentialRegistry.deploy(didRegistryAddress)
  await credentialRegistry.waitForDeployment()
  const credentialRegistryAddress = await credentialRegistry.getAddress()
  console.log("CredentialRegistry deployed to:", credentialRegistryAddress)

  // Deploy CredentialVerifier with both registry addresses
  console.log("Deploying CredentialVerifier...")
  const credentialVerifier = await CredentialVerifier.deploy(credentialRegistryAddress, didRegistryAddress)
  await credentialVerifier.waitForDeployment()
  const credentialVerifierAddress = await credentialVerifier.getAddress()
  console.log("CredentialVerifier deployed to:", credentialVerifierAddress)

  console.log("\n=== Deployment Summary ===")
  console.log("DIDRegistry:", didRegistryAddress)
  console.log("CredentialRegistry:", credentialRegistryAddress)
  console.log("CredentialVerifier:", credentialVerifierAddress)

  // Save deployment addresses to a file
  const fs = require("fs")
  const network = await ethers.provider.getNetwork() // Declare the network variable
  const deploymentInfo = {
    network: network.name,
    timestamp: new Date().toISOString(),
    contracts: {
      DIDRegistry: didRegistryAddress,
      CredentialRegistry: credentialRegistryAddress,
      CredentialVerifier: credentialVerifierAddress,
    },
  }

  fs.writeFileSync(`deployments-${network.name}.json`, JSON.stringify(deploymentInfo, null, 2))

  console.log(`\nDeployment info saved to deployments-${network.name}.json`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
