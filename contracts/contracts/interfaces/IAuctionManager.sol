// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

interface IAuctionManager {
  function list(uint256 loanId, address tokenAddress, uint256 tokenId) external;
  function bid(uint256 loanId, uint256 amount) external;
  function claim(uint256 loanId) external;
}