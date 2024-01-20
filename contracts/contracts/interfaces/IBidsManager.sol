// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

interface IBidsManager {
  function initializeLoan(uint256 loanId, uint256 amount, uint256 maxPremium) external;
  function placeBid(uint256 loanId, uint256 premium, uint256 amount) external returns ( uint256 );
  function getBidReturnAmount(uint256 bidId) external returns (uint256);
  function getLoanPremiumIndex(uint256 loanId) external returns (uint256);
  function getBid(uint256 bidId) external view returns (uint256, uint256, uint256);
  function isLoanFulfilled(uint256 loanId) external returns (bool);
}