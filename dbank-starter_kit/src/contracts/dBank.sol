// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "./Token.sol";

contract dBank {
    //assign Token contract to variable
     Token public devtoken;
     uint256 rate = 1;

    //add mappings
    struct User {
        uint256 amount;
        bool deposited;
        uint256  createdTime;
    }

    mapping(address => User) public users;

    //add events
    event Deposit(address account, uint256 amount, bool deposited);
    event Withdraw(address account, uint256 amount, bool deposited);

    //pass as constructor argument deployed Token contract
    constructor(address _tokenaddress) public {
        //assign token deployed contract to variable
        devtoken  = Token(_tokenaddress);
    }

    function getDeposit() public view returns(uint256) {
      return users[msg.sender].amount;
    }

    function deposit() public payable{
        //check if msg.sender didn't already deposited funds
        require(!users[msg.sender].deposited,"User already deposited");

        //check if msg.value is >= than 0.01 ETH
        require( msg.value >=  0.01 ether,  "Not enough Ether provided.");

        //increase msg.sender ether deposit balance and set msg.sender deposit status to true
        //start msg.sender hodling time
        users[msg.sender] = User( msg.value, true,now);
  
        //emit Deposit event
        emit Deposit(msg.sender, msg.value, true);
    }

    function withdraw() public {
        //check if msg.sender deposit status is true
        require(users[msg.sender].deposited,"No deposit for the user");

        //assign msg.sender ether deposit balance to variable for event
        uint256 balance = users[msg.sender].amount;
        //check user's hodl time

        //calc interest per second
        uint256 daysSinceLastCollect = (now - users[msg.sender].createdTime) / (1 days);
        uint256 interest = daysSinceLastCollect * rate * users[msg.sender].amount;
        interest = 2;
        //calc accrued interest

        //send eth to user
        address payable to = payable(msg.sender);
        to.transfer(users[msg.sender].amount);

        //send interest in tokens to user
        //devtoken.totalSupply = interest;

        devtoken.mint(msg.sender,interest);


        //reset depositer data
        users[msg.sender].amount = 0;
        users[msg.sender].deposited = false;
        //emit event
        emit Withdraw(msg.sender, balance, false);
    }

    function borrow() public payable {
        //check if collateral is >= than 0.01 ETH
        //check if user doesn't have active loan
        //add msg.value to ether collateral
        //calc tokens amount to mint, 50% of msg.value
        //mint&send tokens to user
        //activate borrower's loan status
        //emit event
    }

    function payOff() public {
        //check if loan is active
        //transfer tokens from user back to the contract
        //calc fee
        //send user's collateral minus fee
        //reset borrower's data
        //emit event
    }
}
