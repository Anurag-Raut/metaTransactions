// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenSender{

    using ECDSA for bytes32;


    function transfer (address sender, address receiver,uint256 amount,address tokenContract, bytes memory signature) public {

        bytes32 messageHash=getHash(sender,receiver , amount,tokenContract);
        bytes32 SignedMessage=messageHash.toEthSignedMessageHash();
        address signer =SignedMessage.recover(signature);
        require(signer==msg.sender,"Signature does not come from sender");
        bool sent=ERC20(tokenContract).transferFrom(sender, receiver, amount);
        require(sent,'transaction failed');



    }

    function getHash( address sender,
        address receiver,
        uint256 amount,
        address tokenContract)  public pure returns(bytes32) {
            return
            keccak256(
                abi.encodePacked(sender, receiver,amount, tokenContract)
            );
       
    }


}