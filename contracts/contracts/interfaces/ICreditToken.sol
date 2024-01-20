// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

interface ICreditToken is IERC1155 {
  function mint(address recipient, uint256 bidId, uint256 amount) external;
  function burn(address recipient, uint256 bidId, uint256 amount) external;
}