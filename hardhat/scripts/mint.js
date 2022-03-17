const friends = [
    "0x491ff10fb0EF5859b80500Beb92a42fCe724e8af",
];
const contractAdress = "0x613c427965a0698dF7cA1867927062c00C0C5892";

async function main() {
    //contract instance
    const contractInstance = await hre.ethers.getContractAt("LoveMessageTestnet", contractAdress);

    //signer
    const signer0 = await ethers.provider.getSigner(0);
    const nonce = await signer0.getTransactionCount();
    for (let i = 0; i < friends.length; i++) {
        const tokenURI = "https://gateway.ipfs.io/ipfs/QmcnG9VcMuumREednndN28LjzvPjHPDwh2s7nYW9ynckPk";
        await contractInstance.awardItem(friends[i], tokenURI, {
            nonce: nonce + i
        });
    }

    console.log("Minting is complete!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });