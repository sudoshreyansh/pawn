// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

interface ICreditToken {
  function mint(address recipient, uint256 bidId, uint256 amount) external;
  function burn(address recipient, uint256 bidId, uint256 amount) external;
}