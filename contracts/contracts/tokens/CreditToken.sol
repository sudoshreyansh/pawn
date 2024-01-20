// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/ICreditToken.sol";

contract CreditToken is Ownable, ERC1155, ICreditToken {
  address internal _poolAddress;

  modifier onlyPool() {
    require(msg.sender == _poolAddress);
    _;
  }

  constructor( address poolAddress_ ) Ownable(msg.sender)  ERC1155("") {
    _poolAddress = poolAddress_;
  }

  function setPoolAddress(address poolAddress_) onlyOwner external {
    _poolAddress = poolAddress_;
  }

  function mint(address recipient, uint256 bidId, uint256 amount) onlyPool external {
    _mint(recipient, bidId, amount, "");
  }

  function burn(address recipient, uint256 bidId, uint256 amount) onlyPool external {
    _burn(recipient, bidId, amount);
  }
}