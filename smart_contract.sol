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

    /** @notice Receives money from the sender’s wallet and transfers it to the receiver’s wallet address
      * @dev Check if the receiver’s address was already on the list with the function `receiverExists`. Add the receiver’s address to the sender’s list `senders` with the unconfirmed fields `validated` and increment the number `totalSenders` in the contract. Add the receiver’s address to the waiting receiver list`waitReceive`. Transfer the money received in the function to the receiver’s address
      * @param _address is the receiver’s wallet address that will get the money
      */
    function step1(address _address) public payable {
        require(msg.sender != _address, "You canno validate your own wallet!");
        bool exists = receiverExists(_address);
        if (exists == false){
            require(msg.value > 0, "No money to be transfered!");
            Receiver storage newReceiver = senders[msg.sender].push();
            if (senders[msg.sender].length == 1){
                totalSenders++;
            }
            newReceiver.receiver = _address;
            newReceiver.validated = false;
            waitReceive[_address].push(msg.sender);
            (bool success, ) = payable(_address).call{value: msg.value}("");
            require(success, "Transfer failed.");
        }
        else {
            require(false, "Receiver already request validation!");
        }
    }

    /** @notice Send money from the receiver’s wallet back to the sender’s wallet address to confirm the flow
      * @dev Check if the sender’s address sent money to the receiver calling the function `senderExists`. Get the receiver’s record from the list `senders`. Update the `validated` field to true to confirm that the receiver sent the money back. Remove and reorganize the receiver address from the array `waitReceive`. Transfer the money to the sender
      * @param _address sender's address that will receive the money back
      */
    function step2(address _address) public payable {
        bool exists = senderExists(_address);
        if (exists == true){
            require(msg.value > 0, "No money to be transfered!");
            Receiver[] storage list = senders[_address];
            for (uint i = 0; i < list.length; i++){
                if (list[i].receiver == msg.sender){
                    list[i].validated = true;
                    addressValidated[msg.sender] = true;
                }
            }
            //remove waiting sender from the list
            address[] storage waitRec = waitReceive[msg.sender];
            uint index = waitReceiverIndex(_address);
            for (uint i = index; i<waitRec.length-1; i++){
                waitRec[i] = waitRec[i+1];
            }
            waitRec.pop();
            //Transfer money
            (bool success, ) = payable(_address).call{value: msg.value}("");
            require(success, "Transfer failed.");
        }
        else {
            require(false, "Sender did not request your wallet verification!");
        }
    }

    //********** FUNCTIONS TO GET DATA**********
    /** @notice Get the sender’s address array index
      * @dev Loop the array `waitReceive` that contains the sender’s address to return the index. The index will be used to delete the item from the array
      * @param _address receiver's address that will be marked as completed
      */
    function waitReceiverIndex(address _address) private view returns(uint){
        address[] storage list = waitReceive[msg.sender];
        for (uint i = 0; i < list.length; i++){
            if (list[i] == _address){
                return i;
            }
        }
        return 0;
    }

    /** @notice Verify if the receiver’s belongs to the sender list
      * @dev Get the receivers list from the mapping `senders`. Loop the list to check if the receive belongs to the list
      * @param _address receiver's address that will be verified
      */
    function receiverExists(address _address) public view returns(bool){
        Receiver[] storage list = senders[msg.sender];
        for (uint i = 0; i < list.length; i++){
            if (list[i].receiver == _address){
                return true;
            }
        }
        return false;
    }

    /** @notice Verify if the sender’s has the the receiver in the  list
      * @dev Get the senders from the mapping `senders`. Loop the list to check if the receive belongs to the list
      * @param _address sender's address that will be verified
      */
    function senderExists(address _address) private view returns(bool){
        Receiver[] storage list = senders[_address];
        for (uint i = 0; i < list.length; i++){
            if (list[i].receiver == msg.sender){
                return true;
            }
        }
        return false;
    }

    /** @notice Result the total sender’s that used the smart contract
      * @dev Get the numeric number from the field `totalSenders`
      * @return total senders of the contract
      */
    function sendersCount() public view returns(uint){
        return totalSenders;
    }

    /** @notice Result the total receiver's added by sender
      * @dev Get the array’s length form the mapping `senders` by sender
      * @return Total of receivers
      */
    function receiversCountBySender() public view returns(uint){
        Receiver[] storage list = senders[msg.sender];
        return list.length;
    }

    /** @notice Return if a receiver’s address wallet was already validated by the sender
      * @dev Get the boolean field from the mapping `senders` receiver's array
      * @return True if the receiver’s wallet address was already validated
      */
    function walletValidatedBySender(address _address) public view returns(bool){
        Receiver[] storage list = senders[msg.sender];
        for (uint i = 0; i < list.length; i++){
            if (list[i].receiver == _address){
                return list[i].validated;
            }
        }
        return false;
    }

    /** @notice Return if a receiver’s address wallet was already validated by any sender
      * @dev Get the boolean field from the mapping `addressValidated`
      * param _address is a receiver’s wallet address
      * @return True if the receiver’s wallet address was already validated
      */
    function walletAlreadyValidated(address _address) public view returns(bool){
        return addressValidated[_address];
    }

    /** @notice Retrieve the list of sender’s address waiting the validation by receiver
      * @dev Get the list of sender’s address from the mapping `waitReceive`
      * @return The list of sender’s the receive need to validate
      */
    function sendersWaitingByReceiver() public view returns(address[] memory){
        address[] memory list = waitReceive[msg.sender];
        return list;
    }

    /** @notice Retrieve the list of receiver’s address with the status
      * @dev Get the total list of receiver’s address from the mapping `senders`. Create a new array with the total counted. Add the receiver's info to the array and return it
      * @return The list of receiver’s array `Receiver[]`
      */
    function getReceiversBySender() public view returns(Receiver[] memory){
        uint count = senders[msg.sender].length;
        Receiver[] memory result = new Receiver[](count);

        for (uint i = 0; i < count; i++) {
            Receiver storage receiver = senders[msg.sender][i];
            result[i] = receiver;
        }
        return result;
    }

}
