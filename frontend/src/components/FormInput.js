import { React, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ethers } from 'ethers';
import "./formInput.css"
import LoveMessageTestnet from '../utils/LoveMessageTestnet.json';
import uploadToIpfs from "../utils/upload";

const contractAddresss = "0x613c427965a0698dF7cA1867927062c00C0C5892";


export default function FormInput() {

    const { ethereum } = window;

    let provider;

    const [address, setAddress] = useState(null);

    // useEffect(() => {
    //     if (ethereum) {
    //         //try to connect immediatly, if that fails, address won't be set and the button to manually connect will be shown
    //         connect();
    //     }
    // }, []);

    if (ethereum) {
        console.log("This user has MetaMask!")
        provider = new ethers.providers.Web3Provider(ethereum);

    } else {
        console.log("Please, instal Metamask!");
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
        const contractInstance = new ethers.Contract(contractAddresss, LoveMessageTestnet.abi, signer);
        const currentLoveMessage = await contractInstance.payToMint(to, metadata, {
            gasLimit: 250000,
            value: ethers.utils.parseEther("0.01")
        });
        return currentLoveMessage;
        // setCurrentGreeting(currentLoveMessage);
        // console.log("on mint to: ", to)
        // console.log("on mint metadata: ", metadata)
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

    return (
        <div>
            <div className="container">
                <pre>{JSON.stringify(userInfo, undefined, 2)}</pre>
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
                                type="text" name="nftMessage" placeholder="Enter a lovely message" {...register('nftMessage', { required: "Please enter a message", maxLength: 1600 })}
                            />
                            {/* <input type="text" name="nftMessage" placeholder="Enter a lovely message" {...register('nftMessage', { required: "Please enter a message", maxLength: 160 })} /> */}
                        </div>
                        <p>{errors.nftMessage?.message}</p>
                        {errors.email && errors.email.type === "maxLength" && (
                            <p>Max length exceeded</p>
                        )}
                        <button className="fluid ui button blue" onClick={handleSubmit((data) => generateMetadata(data))} >Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
