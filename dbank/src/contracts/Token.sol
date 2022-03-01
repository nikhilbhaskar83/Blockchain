// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
  //add minter variable

  address public owner;

  //add minter changed event
  event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
  

  constructor() public payable ERC20("IntToken", "DBC") {
    //asign initial minter
    owner = msg.sender;
  }

  modifier isOwner() {
        require(msg.sender == owner);
         _;
    }

 function transferOwnership(address newOwner) public isOwner {
    require(newOwner != address(0));
    OwnershipTransferred(owner, newOwner);
    owner = newOwner;
  }
  //Add pass minter role function

  function mint(address account, uint256 amount) public {
    //check if msg.sender have minter role
    require(msg.sender == owner);
		_mint(account, amount);
	}
}