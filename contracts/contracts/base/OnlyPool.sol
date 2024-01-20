// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract OnlyPool is Ownable {
  address internal _poolAddress;
  
  modifier onlyPool() {
    require(msg.sender == _poolAddress);
    _;
  }

  constructor( address poolAddress_ ) Ownable(msg.sender) {
    _poolAddress = poolAddress_;
  }

  function setPoolAddress(address poolAddress_) onlyOwner external {
    _poolAddress = poolAddress_;
  }
}