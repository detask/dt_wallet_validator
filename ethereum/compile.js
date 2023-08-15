const path = require("path");
const solc = require("solc"); //solidity 
const fs = require("fs-extra"); //file system to access local computer files

//Remove all files on the directory
//const fileName = "Task.sol";
const fileName = "WalletValidator.sol";
const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

//Get the content of the file Task
const taskPath = path.resolve(__dirname, "contracts", fileName);
const source = fs.readFileSync(taskPath, "utf8");


//Solidit will compile everything we get from that file
//https://stackoverflow.com/questions/53353167/npm-solc-assertionerror-err-assertion-invalid-callback-specified
var input = {
    language: 'Solidity',
    sources: {
        "WalletValidator.sol" : {
            content: source
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': [ '*' ]
            }
        }
    }
}; 

const output = JSON.parse(solc.compile(JSON.stringify(input)));
const contracts = output.contracts[fileName]; 

//Create the directory build that will have all contracts
fs.ensureDirSync(buildPath);

for (let contract in contracts) {
    fs.outputJSONSync(
        path.resolve(buildPath, contract + ".json"),
        contracts[contract]
    );
}

