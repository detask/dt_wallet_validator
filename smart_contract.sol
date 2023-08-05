// SPDX-License-Identifier: CLP-3.0
pragma solidity ^0.8.9;

/// @author DeTask team
/// @title Used to check and validate wallet addresses before transfer task’s money
contract WalletValidator{

    ///Used to store data from the wallet receiver's address
    struct Receiver {
        ///address that will receive the money
        address receiver;
        ///Control if the receiver already send the money by the sender
        bool validated;
    }
    ///List of sender’s address waiting for receive the money back by receiver address
    mapping(address => address[]) private waitReceive;
    ///List of structure to control receiver’s status by sender address
    mapping(address => Receiver[]) private senders;
    ///List of validated receiver’s address
    mapping(address => bool) private addressValidated;
    ///Control the total sender that used the smart contract
    uint private totalSenders;


    //********** FUNCTIONS TO CREATE  A VALIDATION **********
    //Steps to validate a wallet
    //1 - step1 (Send money to a destination wallet)
    //2 - step2 (Send money back to the sender)


}
