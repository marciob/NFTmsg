import { React, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ethers } from 'ethers';
import "../formInput.css"
import NftMsg from '../utils/NftMsg.json';
import uploadToIpfs from "../utils/upload";
import axios from 'axios';

const contractAddresss = "0x9f3481c864B5EA818E28e145bf29EC1Aa5743782";

export default function FormInput() {

    const { ethereum } = window;

    let provider;

    const [address, setAddress] = useState(null);

    const [tokenByAddress, setTokenByAddress] = useState([]);

    const [newTokenByAddress, setNewTokenByAddress] = useState([]);

    // useEffect(() => {
    //     if (ethereum) {
    //         //try to connect immediatly, if that fails, address won't be set and the button to manually connect will be shown
    //         connect();
    //     }
    // }, []);

    async function checkMetamask() {

        if (ethereum) {
            console.log("This user has MetaMask!")
            provider = new ethers.providers.Web3Provider(ethereum);

        } else {
            console.log("Please, instal Metamask!");
        }
    }


    async function connect() {

        await ethereum.request({ method: 'eth_requestAccounts' });

        const signer = await provider.getSigner();
        const addr1 = await signer.getAddress();
        const userBalance = await provider.getBalance(addr1);

        setAddress(addr1);
    }


    const { register, handleSubmit, formState: { errors } } = useForm();

    const [userInfo, setUserInfo] = useState();

    async function mint(to, metadata) {
        const signer = await provider.getSigner();
        const contractInstance = new ethers.Contract(contractAddresss, NftMsg.abi, signer);
        const currentNftMsg = await contractInstance.safeMint(to, metadata);
        // const currentNftMsg = await contractInstance.specialMint(to, metadata, {
        //     gasLimit: 250000,
        //     value: ethers.utils.parseEther("0.01")
        // });
        return currentNftMsg;

    }

    async function generateMetadata(data) {
        setUserInfo(data);

        const signer = await provider.getSigner();
        const addr1 = await signer.getAddress();

        const _address = await data.toAddress;
        const _msg = await data.nftMessage;


        console.log(_msg);
        console.log("generateMetadata info:", data);

        const metadata_ = await uploadToIpfs(addr1, _address, "message", _msg);

        mint(_address, metadata_.path);

    }

    async function adjustURI(uri_) {
        return uri_.replace("ipfs://", "https://ipfs.io/ipfs/");
    }

    // async function getAllNftData() {
    //     const signer = await provider.getSigner();
    //     const contractInstance = new ethers.Contract(contractAddresss, NftMsg.abi, signer);

    //     let totalSupply = await contractInstance.totalSupply();

    //     totalSupply = totalSupply.toNumber();

    //     for (let i = 0; i < totalSupply; i++) {

    //         let tokenURI = await contractInstance.tokenURI(i);
    //         let tokenURI_formated = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");

    //         axios.get(tokenURI_formated)
    //             .then(function (response) {
    //                 let item = {
    //                     tokenId: i,
    //                     from: response.data.attributes[0].value,
    //                     to: response.data.attributes[1].value,
    //                     image: response.data.image,
    //                     message: response.data.attributes[3].value,
    //                 }
    //                 // console.log(item);
    //                 i++;
    //             })
    //             .catch(function (error) {
    //                 // handle error
    //                 console.log(error);
    //             })
    //     }
    // }

    async function getIpfsById(tokenId) {
        const signer = await provider.getSigner();
        const contractInstance = new ethers.Contract(contractAddresss, NftMsg.abi, signer);

        let ipfs_data = await contractInstance.tokenURI(tokenId);

        ipfs_data = ipfs_data.replace("ipfs://", "https://ipfs.io/ipfs/");

        //console.log(ipfs_data);

        return ipfs_data;
    }

    async function getNftByAddress(_address) {
        const signer = await provider.getSigner();
        const contractInstance = new ethers.Contract(contractAddresss, NftMsg.abi, signer);

        //get tokens ID owned by some address
        let tokensOwnedByAddr = await contractInstance.getTokenIds(_address);
        // let totalOwner = tokensOwnedByAddr.length;
        // let ownedTokens;

        let arrayOfTokens = [];

        await tokensOwnedByAddr.forEach(result => {

            arrayOfTokens.push(result.toNumber());

        })

        setTokenByAddress(arrayOfTokens);

        console.log(tokenByAddress);

        console.log(await getIpfsById(arrayOfTokens[0]));

        // tokensOwnedByAddr.forEach(result => {
        //     // setTokenByAddress(result.toNumber());
        //     setNewTokenByAddress([...tokenByAddress, result.toNumber()])

        // })

        // // console.log(Array.isArray(tokensOwnedByAddr));
        // console.log(newTokenByAddress);



        // console.log(Array.isArray(tokenByAddress));

        // console.log(tokensOwnedByAddr[0].toNumber());

        // for (let i = 0; i < totalOwner; i++) {
        //     ownedTokens = tokensOwnedByAddr[i].toString();

        //     tokenURI = await contractInstance.tokenURI(ownedTokens);
        //     tokenURI_formated = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");

        //     axios.get(tokenURI_formated)
        //         .then(function (response) {
        //             let item = {
        //                 tokenId: i,
        //                 image: response.data.image,
        //                 message: response.data.attributes[3].value
        //             }

        //             setTokenByAddress(item);

        //             console.log(tokenByAddress);
        //             i++;
        //         })
        //         .catch(function (error) {
        //             // handle error
        //             console.log(error);
        //         })
        // }
    }

    useEffect(() => {
        checkMetamask();

        getNftByAddress("0xeef18463fcb59d04d396b6dff5dcd1929fb77997");
    }, [])


    // let item = {
    //     tokenId: i,
    //     from: response.data.attributes[0].value,
    //     to: response.data.attributes[1].value,
    //     image: response.data.image,
    //     message: response.data.attributes[3].value,
    // }


    return (
        <div>
            <div className="container">
                <form >
                    <h1>NFT Message</h1>
                    <div className="ui divider"></div>
                    <div className="ui form">
                        {
                            address == null ? ("") : (
                                <div className="field">
                                    <label>From: {address}</label>
                                </div>)
                        }
                        <div className="field">
                            <label>To</label>
                            <input type="text" name="toAddress" placeholder="Ethereum wallet address" {...register('toAddress', { required: "Please enter an Ethereum wallet address", maxLength: 42 })} />
                        </div>
                        <p>{errors.toAddress?.message}</p>
                        {errors.toAddress && errors.toAddress.type === "maxLength" && (
                            <p>That is not a valid address</p>
                        )}
                        {/* {errors.walletAddress && errors.walletAddress.type === "minLength" && (
                        <p>That is not a valid address</p>
                    )} */}
                        <div className="field">
                            <label>Message</label>
                            <textarea
                                rows={5}
                                cols={5}
                                type="text" name="nftMessage" placeholder="Enter a message" {...register('nftMessage', { required: "Please enter a message", maxLength: 1600 })}
                            />
                            {/* <input type="text" name="nftMessage" placeholder="Enter a message" {...register('nftMessage', { required: "Please enter a message", maxLength: 160 })} /> */}
                        </div>
                        <p>{errors.nftMessage?.message}</p>
                        {errors.email && errors.email.type === "maxLength" && (
                            <p>Max length exceeded</p>
                        )}
                        <button className="fluid ui button blue" onClick={handleSubmit((data) => generateMetadata(data))} >Submit</button>
                    </div>
                </form>
                <div>
                    {tokenByAddress == null ? ("") : (
                        <div >
                            {
                                // tokenByAddress.map((nft, i) => (
                                //     <div key={i}>
                                //         <p>{nft.message}</p>
                                //     </div>
                                // ))
                            }
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
{/* <img src={tokenByAddress.image} width={200} height={200} />
                                <p>{tokenByAddress.message}</p> */}

{/* {Object.keys(tokenByAddress).map((nft, i) => (
                                <div key={i}>
                                    Key: {i}
                                    <p>{nft.tokenId}</p>
                                </div>
                            ))} */}
{
    // tokenByAddress.map((nft, i) => (
    //     <div key={i}>
    //         <p>{nft.message}</p>
    //     </div>
    // ))
}