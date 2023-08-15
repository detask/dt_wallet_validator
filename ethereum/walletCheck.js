//This is the pre-configure instance of the task that can be used in all the project
import web3 from "./web3";
import walletValidator from "./build/WalletValidator.json";

const instance = web3 && new web3.eth.Contract(
    walletValidator.abi,
    "0xA17BB6A383B6deac8e32DaFf21e73aC12B0082b2" //Dev = "0xA17BB6A383B6deac8e32DaFf21e73aC12B0082b2" //Wallet Contract address save on the block chain after run deployed.js
);

export default instance;