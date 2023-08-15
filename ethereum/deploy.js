const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const compiledWalletValidator = require('./build/WalletValidator.json'); //we will only compile the Facture because the task will be created inside the Facture

const provider = new HDWalletProvider(
    '', //Metamask to acasses public and private key (Nemonic) // remember to change this to your own phrase!
    '', ////https://infura.io/ to get the Rinkeby URL to access the network // remember to change this to your own endpoint!,
    //gasLimit: 1000000000
);

//BNB Chain
/*
bsc: {
      provider: () => new HDWalletProvider(mnemonic, 'https://bsc-dataseed.binance.org'),
      network_id: 56,
    },
},
bsc-testnet: {
      provider: () => new HDWalletProvider(mnemonic, 'https://data-seed-prebsc-1-s1.binance.org:8545'),
      network_id: 97,
}
*/

//https://github.com/ChainSafe/web3.js/blob/1.x/docs/web3-eth-contract.rst
const web3 = new Web3(provider);

const deploy = async () => {

    const accounts = await web3.eth.getAccounts();
    console.log('Account', accounts[0]);

     //Create Master Contract Task
     const result = await new web3.eth.Contract(compiledWalletValidator.abi)
     .deploy({ data: compiledWalletValidator.evm.bytecode.object })
     .send({ from: accounts[0] })
     .on('error', function(error){ console.log(error) });
 
     console.log('WalletValidator', result.options.address); 
    
    //We will need to get this address to use in our App
    provider.engine.stop();
};
deploy();

//WalletValidator 0x63C50b9769a15DAaC8Ab86Dd6ee298123cb08944

//If we want to test the campain with out browser and app, we can use https://remix.ethereum.org/
//1 - Go the de Deploy and Select: Environment = Injectd Web3
//2 - Matamaske: Make sure you have Rinkbeby Networ select - Check the account info with the account on Deployed
//3 - Contract: Select the TaskFacture
//4 - Publish, enter the Deployed Address and click on "At Address" to create a instance of the facture


