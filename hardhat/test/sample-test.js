const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NftMsg", function () {
  it("Should mint and transfer an NFT to someone", async function () {
    const NftMsg = await ethers.getContractFactory("NftMsg");
    const nftMsg = await NftMsg.deploy();
    await nftMsg.deployed();

    const recipient = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';
    const metadataURI = 'cid/test.png';

    let balance = await nftMsg.balanceOf(recipient);
    expect(balance).to.equal(0);

    const newlyMintedToken = await nftMsg.safeMint(recipient, metadataURI);

    // wait until the transaction is mined
    await newlyMintedToken.wait();

    balance = await nftMsg.balanceOf(recipient)
    expect(balance).to.equal(1);

    expect(await nftMsg.isContentOwned(metadataURI)).to.equal(true);
    const newlyMintedToken2 = await nftMsg.safeMint(recipient, 'foo',);
  });
});

//npx hardhat test
