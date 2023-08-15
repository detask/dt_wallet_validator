const assert = require("assert");
const ganache = require("ganache-cli");
//Web3 constructor
const Web3 = require("web3");
//web3 instancessss, with an option to increase the gas limit to test the contract
const options = { gasLimit: 1000000000 };
const web3 = new Web3(ganache.provider(options));

const compiledTaskTreasury = require("../ethereum/build/WalletValidator.json");
const compiledTransfer = require("../ethereum/build/WalletValidator.json");

let accounts;
let treasury;
let transfer;

beforeEach(async() => {

    //Created by ganache and give us 10 address to use
    accounts = await web3.eth.getAccounts();
    
    //console.log("Attempting to deploy from account", accounts[0]);
    treasury = await new web3.eth.Contract(compiledTaskTreasury.abi)
    .deploy({ data: compiledTaskTreasury.evm.bytecode.object })
    .send( { from: accounts[0], gas: "1000000000" } );
    //console.log("Config", taskTreasuryConfig.options.address);

    transfer = await new web3.eth.Contract(compiledTransfer.abi)
    .deploy({ data: compiledTransfer.evm.bytecode.object })
    .send( { from: accounts[0], gas: "1000000000" } );
    
});

describe("Wallet", () => {

    it("deploys a wallet contract", () => {
        assert.ok(treasury.options.address);
    });


    describe("request", () => {

      it('owner create a new request', async () => {

          await treasury.methods
          .createRequest('Buy batteries', '100', accounts[1])
          .send({
              gas: '1000000',
              from: accounts[0]
          });

          const request = await treasury.methods.requests(0).call();
          assert.equal('Buy batteries', request.description);
      });

    });

});
