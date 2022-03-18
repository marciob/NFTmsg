const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NftMsg", function () {
  it("Should mint and transfer an NFT to someone", async function () {
    const NftMsg = await ethers.getContractFactory("NftMsg");
    const nftMsg = await NftMsg.deploy();
    await nftMsg.deployed();

    console.log(nftMsg.address);

    const recipient = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';
    const metadataURI = 'fileData.png';

    let balance = await nftMsg.balanceOf(recipient);
    expect(balance).to.equal(0);

    const newlyMintedToken = await nftMsg.safeMint(recipient, metadataURI);

    // wait until the transaction is mined
    await newlyMintedToken.wait();

    //check balance to see if address has received 1 nft from mint
    balance = await nftMsg.balanceOf(recipient);
    expect(balance).to.equal(1);

  });
});

//npx hardhat test
