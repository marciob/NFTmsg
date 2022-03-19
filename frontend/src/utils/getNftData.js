const ethers = require('ethers');
const axios = require('axios');
const NftMsg = require('./NftMsg.json');
require("dotenv").config();

let provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_ETHERSCAN_KEY);

const contractAddresss = "0x1807F04587F4928d2526d1bAD4986c69550FE04d";

async function getNftData() {
    const signer = await provider.getSigner();
    const contractInstance = new ethers.Contract(contractAddresss, NftMsg.abi, signer);

    const tokenURI_ = await contractInstance.tokenURI(0);

    const items = await Promise.all(tokenURI_.map(async i => {
        console.log(i);
        return i;
    }
    ));

}

getNftData()
