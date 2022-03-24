// import { create } from "ipfs-http-client";
const { create } = require("ipfs-http-client");

const ipfs = create("https://ipfs.infura.io:5001");

// we added two attributes, add as many as you want!
export default async function uploadToIpfs(from, to, msg, content) {
    const files = [{
        path: '/',
        content: JSON.stringify({
            name: "NFTmsg",
            attributes: [
                {
                    "trait_type": "From",
                    "value": `${from}`
                },
                {
                    "trait_type": "To",
                    "value": `${to}`
                },
                {
                    "trait_type": "Message type",
                    "value": `${msg}`
                },
                {
                    "trait_type": "Content",
                    "value": `${content}`
                },
            ],
            image: "https://gateway.ipfs.io/ipfs/QmVW3cHid4tvCm7WtBhcTYzVjmGDmSG5jdT7BnkQ9W3g39",
            description: "NFT messages sent on chain"
        })
    }];

    const result = await ipfs.add(files);
    console.log(result);
    return result;
}
