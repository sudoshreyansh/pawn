// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

interface IPawnPool {
  function auctionComplete(uint256 loanId, uint256 amount) external;
}