// // SPDX-License-Identifier: UNLICENSED
// pragma solidity ^0.8.20;

// import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "@aave/core-v3/contracts/interfaces/IPool.sol";
// import "./interfaces/IReceiptToken.sol";
// import "./interfaces/IBidsManager.sol";
// import "./interfaces/ICreditToken.sol";

// contract PawnPool is Ownable {
//   IReceiptToken internal _receiptToken;
//   ICreditToken internal _creditToken;
//   IBidsManager internal _bidsManager;
//   IPool internal _aavePool;
//   IERC20 internal _ghoToken;

//   uint256 internal _nextLoanId;

//   struct Asset {
//     address tokenAddress;
//     uint256 tokenId;
//   }

//   enum LoanStatus {
//     Requested,
//     Approved,
//     Repayed,
//     Liquidated,
//     Cancelled
//   }

//   struct Loan {
//     LoanStatus status;
//     address recipient;
//     Asset collateral;
//     uint256 principal;
//     uint256 maxPremium;
//     uint256 sanctionedAmount;
//     uint256 sanctionedPremium;
//     uint256 requestTimestamp;
//     uint256 expiry;
//     uint256 startIndex;
//   }

//   mapping (uint256 => Loan) internal _loans;
//   mapping (address => mapping(uint256 => uint256)) internal _bids;

//   event LoanRequested(address recipent, Loan loan);
//   event LoanTransferred(uint256 loanId, address oldRecipient, address newRecipient);

//   modifier onlyReceiptToken() {
//     require(msg.sender == address(_receiptToken));
//     _;
//   }

//   constructor() Ownable(msg.sender) {
//     _nextLoanId = 1;
//   }

//   function initialize(
//     address receiptTokenAddress,
//     address bidsManagerAddress,
//     address aavePoolAddress,
//     address ghoTokenAddress
//   ) onlyOwner external {
//     _receiptToken = IReceiptToken(receiptTokenAddress);
//     _bidsManager = IBidsManager(bidsManagerAddress);
//     _aavePool = IPool(aavePoolAddress);
//     _ghoToken = IERC20(ghoTokenAddress);
//   }

//   function requestLoan(
//     address collateralTokenAddress,
//     uint256 collateralTokenId,
//     uint256 principal,
//     uint256 premium,
//     uint256 expiry
//   ) external {
//     uint256 loanId = _nextLoanId;
//     _nextLoanId += 1;

//     IERC721(collateralTokenAddress).safeTransferFrom(msg.sender, address(_receiptToken), collateralTokenId);
//     _receiptToken.mint(loanId, msg.sender);
//     _bidsManager.initializeLoan(loanId, principal);

//     _loans[loanId] = Loan(
//       LoanStatus.Requested,
//       msg.sender,
//       Asset(
//         collateralTokenAddress,
//         collateralTokenId
//       ),
//       principal,
//       premium,
//       0,
//       0,
//       block.timestamp,
//       expiry,
//       1
//     );

//     emit LoanRequested(msg.sender, _loans[loanId]);
//   } 

//   function transferLoan ( uint256 loanId, address newRecipient ) onlyReceiptToken external {
//     require(_loans[loanId].status == LoanStatus.Approved);

//     address oldRecipient = _loans[loanId].recipient;
//     _loans[loanId].recipient = newRecipient;

//     emit LoanTransferred(loanId, oldRecipient, newRecipient);
//   }

//   function placeBid ( uint256 loanId, uint256 premium, uint256 amount ) external {
//     require(_loans[loanId].status == LoanStatus.Requested || _loans[loanId].status == LoanStatus.Approved);
//     require(block.timestamp <= _loans[loanId].requestTimestamp + 1 days);
//     require(_bids[msg.sender][loanId] == 0);
//     require(_loans[loanId].maxPremium >= premium);

//     _aavePool.borrow(address(_ghoToken), amount, 2, 0, msg.sender);
//     uint256 bidId = _bidsManager.placeBid(loanId, premium, amount);
//     _creditToken.mint(msg.sender, bidId, amount);

//     _bids[msg.sender][loanId] = bidId;
//     _loans[loanId].sanctionedAmount += amount;
//     _loans[loanId].sanctionedPremium = _bidsManager.getLoanPremium(loanId);
//     _loans[loanId].startIndex = _aavePool.getReserveNormalizedVariableDebt(address(_ghoToken));
//   }

//   function collectUnplacedBid ( uint256 bidId ) external {
//     (uint256 loanId,,) = _bidsManager.getBid(bidId);
//     require(block.timestamp > _loans[loanId].requestTimestamp + 1 days || _loans[loanId].status == LoanStatus.Repayed);
    
//     uint256 returnAmount = _bidsManager.getBidReturnAmount(bidId);
//     require(returnAmount > 0);

//     _creditToken.burn(msg.sender, bidId, returnAmount);
//     _ghoToken.transfer(msg.sender, returnAmount);
//   }

//   function collectRepayedLoan ( uint256 bidId ) external {
//     (uint256 loanId, uint256 bidAmount,) = _bidsManager.getBid(bidId);
//     require(_loans[loanId].status == LoanStatus.Repayed);

//     uint256 returnAmount = _bidsManager.getBidReturnAmount(bidId);
//     uint256 repayAmount = bidAmount - returnAmount;
    
//   }

//   function collectLoan ( uint256 loanId ) external {
//   }

//   function repayLoan ( uint256 loanId ) external {

//   }

//   function liquidateLoan ( uint256 loanId ) external {

//   }

//   // function cancelLoan ( uint256 loanId ) external {
//   //   require(_loans[loanId].recipient == msg.sender);

//   //   _cancelLoan(loanId, msg.sender);
//   // }

//   // function _cancelLoan( uint256 loanId, address collateralRecipient ) internal {
//   //   Loan memory loan = _loans[loanId];

//   //   require(loan.status == LoanStatus.Requested);
//   //   require(loan.sanctioned == 0);
    
//   //   _receiptToken.burn(loanId, loan.collateral.tokenAddress, loan.collateral.tokenId, collateralRecipient);
//   //   delete _loans[loanId];
//   // }

//   // function _cancelLoan( uint256 loanId ) internal {
//   //   _cancelLoan(loanId, msg.sender);
//   // }
// }