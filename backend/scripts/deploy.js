async function main() {
    const LoveMessageTestnet = await hre.ethers.getContractFactory("LoveMessageTestnet");
    const contractInstance = await LoveMessageTestnet.deploy();

    await contractInstance.deployed();

    console.log("LoveMessageTestnet deployed to:", contractInstance.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });