// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "../interfaces/IBidsManager.sol";

contract CreditToken is ERC1155 {
  constructor() ERC1155("") {}

  function mint(uint256 bidId, address recipient, uint256 amount) external {
  }
}