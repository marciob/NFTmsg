async function main() {
    const NftMsgTestnet = await hre.ethers.getContractFactory("NftMsg");
    const contractInstance = await NftMsgTestnet.deploy();

    await contractInstance.deployed();

    console.log("NftMsg deployed to:", contractInstance.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });