import { React, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import uploadToIpfs from '../utils/upload';

function ConnectWallet() {

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

    async function writeToIpfs(from, to, msg) {

        //console.log(uploadToIpfs());
        uploadToIpfs("from_0x0as0fd0d00", "to_0x02sdkjsksjkds", "This is a love message to you.");

        console.log("getIpfsData was clicked");

    }

    return (
        <div >
            <nav>
                <div>
                    <button className="my-button" onClick={connect}>
                        {
                            address == null ? (<div>Connect</div>) : (<div>Connected</div>)
                        }
                    </button>
                </div>

            </nav>
            <div>
                {
                    address == null ? (<div></div>) : (<div>Your address: {address}</div>)
                }
            </div>
        </div>
    );
}

export default ConnectWallet;
