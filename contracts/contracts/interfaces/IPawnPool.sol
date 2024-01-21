// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

interface IPawnPool {
  enum LoanStatus {
    None,
    Requested,
    Collected,
    Repayed,
    UnderAuction,
    Liquidated,
    Cancelled
  }
  
  struct Asset {
    address tokenAddress;
    uint256 tokenId;
  }

  struct Loan {
    LoanStatus status;
    Asset collateral;
    uint256 principal;
    uint256 maxPremium;
    uint256 requestTimestamp;
    uint256 collectTimestamp;
    uint256 repayTimestamp;
    uint256 expiry;
    uint256 startAaveDebtIndex;
    uint256 endAaveDebtIndex;
    uint256 liquidatedAmount;
  }

  function auctionComplete(uint256 loanId, uint256 amount) external;
  function isReceiptTransferAllowed ( uint256 loanId ) external view;
  function isCreditTransferAllowed ( uint256 bidId ) external view;
  function getLoanDetails (uint256 loanId) external view returns (Loan memory);
  function getBidDetailsForLoan ( address user, uint256 loanId ) external view returns (uint256, uint256, uint256);
  function getBidDetails ( uint256 bidId ) external view returns (uint256, uint256, uint256);
}