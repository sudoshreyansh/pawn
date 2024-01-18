// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

interface IBidsManager {
  function placeBid(address bidder, uint256 loanId, uint256 premium, uint256 amount) external;
  function getBidReturnAmount(address bidder, uint256 loanId) external returns (uint256);
  function getLoanPremium(uint256 loanId) external returns (uint256);
}