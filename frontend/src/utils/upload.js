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
            // if you want to upload your own IPFS image, you can do so here:
            // https://github.com/ChainShot/IPFS-Upload
            // or you can use https://www.pinata.cloud/
            image: "https://gateway.pinata.cloud/ipfs/QmZMd88oazmVDv7mL6oqE1jMG1ffX5ufU3v9MeVgygFKpz/",
            description: "NFT messages sent on chain"
        })
    }];

    const result = await ipfs.add(files);
    console.log(result);
    return result;
}
