// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./interfaces/IReceiptToken.sol";
import "./interfaces/IBidsManager.sol";

contract PawnPool is Ownable {
  IReceiptToken internal _receiptToken;
  IBidsManager internal _bidsManager;
  uint256 internal _nextLoanId;

  struct Asset {
    address tokenAddress;
    uint256 tokenId;
  }

  enum LoanStatus {
    Requested,
    Approved,
    Repayed,
    Liquidated,
    Cancelled
  }

  struct Loan {
    LoanStatus status;
    address recipient;
    Asset collateral;
    uint256 principal;
    uint256 maxPremium;
    uint256 sanctionedAmount;
    uint256 sanctionedPremium;
    uint256 requestTimestamp;
    uint256 expiry;
    uint256 startIndex;
  }

  mapping (uint256 => Loan) internal _loans;

  event LoanRequested(address recipent, Loan loan);
  event LoanTransferred(uint256 loanId, address oldRecipient, address newRecipient);

  modifier onlyReceiptToken() {
    require(msg.sender == address(_receiptToken));
    _;
  }

  constructor() Ownable(msg.sender) {
    _nextLoanId = 1;
  }

  function initialize(
    address receiptTokenAddress
  ) onlyOwner external {
    _receiptToken = IReceiptToken(receiptTokenAddress);
  }

  function requestLoan(
    address collateralTokenAddress,
    uint256 collateralTokenId,
    uint256 principal,
    uint256 premium,
    uint256 expiry
  ) external {
    uint256 loanId = _nextLoanId;
    _nextLoanId += 1;

    IERC721(collateralTokenAddress).safeTransferFrom(msg.sender, address(_receiptToken), collateralTokenId);
    _receiptToken.mint(loanId, msg.sender);
    _bidsManager.initializeLoan(loanId, principal);

    _loans[loanId] = Loan(
      LoanStatus.Requested,
      msg.sender,
      Asset(
        collateralTokenAddress,
        collateralTokenId
      ),
      principal,
      premium,
      0,
      0,
      block.timestamp,
      expiry,
      1
    );

    emit LoanRequested(msg.sender, _loans[loanId]);
  } 

  function transferLoan(
    uint256 loanId,
    address newRecipient
  ) onlyReceiptToken external {
    require(_loans[loanId].status == LoanStatus.Approved);

    address oldRecipient = _loans[loanId].recipient;
    _loans[loanId].recipient = newRecipient;

    emit LoanTransferred(loanId, oldRecipient, newRecipient);
  }

  function placeBid( uint256 loanId ) external {
    
  }

  // function cancelLoan ( uint256 loanId ) external {
  //   require(_loans[loanId].recipient == msg.sender);

  //   _cancelLoan(loanId, msg.sender);
  // }

  // function _cancelLoan( uint256 loanId, address collateralRecipient ) internal {
  //   Loan memory loan = _loans[loanId];

  //   require(loan.status == LoanStatus.Requested);
  //   require(loan.sanctioned == 0);
    
  //   _receiptToken.burn(loanId, loan.collateral.tokenAddress, loan.collateral.tokenId, collateralRecipient);
  //   delete _loans[loanId];
  // }

  // function _cancelLoan( uint256 loanId ) internal {
  //   _cancelLoan(loanId, msg.sender);
  // }
}