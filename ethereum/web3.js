import Web3 from "web3";

let web3;

//Web3 will be accessed by the server and client. Each will have a different behavior
//We are accesss the ETH Network from the server with Next.Js to get the data we need do display on the page
//The user does not neeed to connect to Metamask because we are displaying the data
if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    // We are in the browser and metamask is running.
    window.ethereum.request({ method: "eth_requestAccounts" });
    web3 = new Web3(window.ethereum);
} else {

    //console.log("NOT Metamask")
    // We are on the server *OR* the user is not running metamask
    //const provider = new Web3.providers.HttpProvider(
    //     "" //URL Provider Alchemy 
    //     );

    // web3 = new Web3(provider);
}
   
export default web3;