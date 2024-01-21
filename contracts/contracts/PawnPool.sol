// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@aave/core-v3/contracts/interfaces/IPool.sol";
import "./interfaces/IReceiptToken.sol";
import "./interfaces/IBidsManager.sol";
import "./interfaces/ICreditToken.sol";
import "./interfaces/IAuctionManager.sol";
import "./interfaces/IPawnPool.sol";
import "hardhat/console.sol";

contract PawnPool is Ownable, IPawnPool {
  IReceiptToken internal _receiptToken;
  ICreditToken internal _creditToken;
  IBidsManager internal _bidsManager;
  IAuctionManager internal _auctionManager;
  IPool internal _aavePool;
  IERC20 internal _ghoToken;

  uint256 internal _nextLoanId;

  mapping (uint256 => Loan) internal _loans;
  mapping (address => mapping(uint256 => uint256)) internal _bids;

  event LoanRequested(address recipent, Loan loan);
  event LoanTransferred(uint256 loanId, address oldRecipient, address newRecipient);

  modifier onlyAuctionManager() {
    require(msg.sender == address(_auctionManager));
    _;
  }

  constructor() Ownable(msg.sender) {
    _nextLoanId = 1;
  }

  function initialize(
    address receiptTokenAddress,
    address creditTokenAddress,
    address bidsManagerAddress,
    address auctionManagerAddress,
    address aavePoolAddress,
    address ghoTokenAddress
  ) onlyOwner external {
    _receiptToken = IReceiptToken(receiptTokenAddress);
    _creditToken = ICreditToken(creditTokenAddress);
    _bidsManager = IBidsManager(bidsManagerAddress);
    _auctionManager = IAuctionManager(auctionManagerAddress);
    _aavePool = IPool(aavePoolAddress);
    _ghoToken = IERC20(ghoTokenAddress);
  }

  function requestLoan(
    address collateralTokenAddress,
    uint256 collateralTokenId,
    uint256 principal,
    uint256 premium,
    uint256 expiry
  ) external {
    require(expiry > 1 days);
    require(principal >= 100*1e18);

    uint256 loanId = _nextLoanId;
    _nextLoanId += 1;

    IERC721(collateralTokenAddress).transferFrom(msg.sender, address(this), collateralTokenId);
    _receiptToken.mint(loanId, msg.sender);
    _bidsManager.initializeLoan(loanId, premium, principal);

    _loans[loanId] = Loan(
      LoanStatus.Requested,
      Asset(
        collateralTokenAddress,
        collateralTokenId
      ),
      principal,
      premium,
      block.timestamp,
      0,
      0,
      expiry,
      1,
      1,
      0
    );

    emit LoanRequested(msg.sender, _loans[loanId]);
  }

  function isBiddingOver ( uint256 loanId ) view external returns (bool) {
    return _isBiddingOver(loanId);
  }

  function _isBiddingOver ( uint256 loanId ) view internal returns (bool) {
    LoanStatus loanStatus = _loans[loanId].status;
    uint256 loanRequestTime = _loans[loanId].requestTimestamp;
    bool isTimeFinished = (block.timestamp <= loanRequestTime + 1 days);
    bool isLoanAvailable = (loanStatus == LoanStatus.Requested || loanStatus == LoanStatus.Collected);

    return !(isTimeFinished && isLoanAvailable);
  }

  function placeBid ( uint256 loanId, uint256 premium, uint256 amount ) external {
    require(_isBiddingOver(loanId) == false);
    require(_bids[msg.sender][loanId] == 0);
    require(_loans[loanId].maxPremium >= premium);
    require(_loans[loanId].principal <= amount * 20);

    _aavePool.borrow(address(_ghoToken), amount, 2, 0, msg.sender);
    uint256 bidId = _bidsManager.placeBid(loanId, premium, amount);
    _creditToken.mint(msg.sender, bidId, amount);

    _bids[msg.sender][loanId] = bidId;

    if ( _loans[loanId].status == LoanStatus.Requested ) {
      _loans[loanId].startAaveDebtIndex = _aavePool.getReserveNormalizedVariableDebt(address(_ghoToken));
    }
  }

  function getUnplacedBidAmount ( uint256 bidId ) external view returns (uint256) {
    return _bidsManager.getBidReturnAmount(bidId);
  }

  function collectUnplacedBid ( uint256 bidId ) external {
    (uint256 loanId,,) = _bidsManager.getBid(bidId);
    require(_isBiddingOver(loanId));
    
    uint256 returnAmount = _bidsManager.getBidReturnAmount(bidId);
    require(returnAmount > 0);

    uint256 creditBalance = _creditToken.balanceOf(msg.sender, bidId);
    require(creditBalance >= returnAmount);

    _creditToken.burn(msg.sender, bidId, returnAmount);
    _ghoToken.transfer(msg.sender, returnAmount);
  }

  function collectRepayedLoan ( uint256 bidId ) external {
    (uint256 loanId, uint256 premium, uint256 amount) = _bidsManager.getBid(bidId);
    require(_loans[loanId].status == LoanStatus.Repayed);

    uint256 principal = _creditToken.balanceOf(msg.sender, bidId);
    require(principal <= amount - _bidsManager.getBidReturnAmount(bidId));

    uint256 repayAmount = _calculateLenderShare(loanId, premium, principal);
    _ghoToken.transfer(msg.sender, repayAmount);
    _creditToken.burn(msg.sender, bidId, principal);
  }

  function collectLiquidatedLoan ( uint256 loanId ) external {
    require(_loans[loanId].status == LoanStatus.Liquidated);
    
    uint256 bidId = _bids[msg.sender][loanId];
    uint256 lenderShare = _creditToken.balanceOf(msg.sender, bidId);
    require(lenderShare > 0);

    uint256 amount = (_loans[loanId].liquidatedAmount * lenderShare) / _loans[loanId].principal;
    _ghoToken.transfer(msg.sender, amount);
    _creditToken.burn(msg.sender, bidId, lenderShare);
  }

  function collectLoan ( uint256 loanId ) external {
    require(_loans[loanId].status == LoanStatus.Requested);
    require(_bidsManager.isLoanFulfilled(loanId));
    require(_receiptToken.ownerOf(loanId) == msg.sender);

    _ghoToken.transfer(msg.sender, _loans[loanId].principal);
    _loans[loanId].status = LoanStatus.Collected;
    _loans[loanId].collectTimestamp = block.timestamp;
  }

  function repayLoan ( uint256 loanId ) external {
    require(_receiptToken.ownerOf(loanId) == msg.sender);
    require(_loans[loanId].status == LoanStatus.Collected);
    require(_loans[loanId].requestTimestamp + _loans[loanId].expiry >= block.timestamp);

    uint256 amount = _calculateRepayAmount(loanId);
    _ghoToken.transferFrom(msg.sender, address(this), amount);
    IERC721(_loans[loanId].collateral.tokenAddress).transferFrom(address(this), msg.sender, _loans[loanId].collateral.tokenId);
    _receiptToken.burn(loanId);
    
    _loans[loanId].status = LoanStatus.Repayed;
    _loans[loanId].repayTimestamp = block.timestamp;
    _loans[loanId].endAaveDebtIndex = _aavePool.getReserveNormalizedVariableDebt(address(_ghoToken));
  }

  function liquidateLoan ( uint256 loanId ) external {
    uint256 requestTimestamp = _loans[loanId].requestTimestamp;
    uint256 collectTimestamp = _loans[loanId].collectTimestamp;
    uint256 startTimestamp = (requestTimestamp + 1 days > collectTimestamp ? collectTimestamp : requestTimestamp + 1 days);
    require(block.timestamp >= startTimestamp + _loans[loanId].expiry);
    require(_loans[loanId].status == LoanStatus.Requested || _loans[loanId].status == LoanStatus.Collected);

    _receiptToken.burn(loanId);
    IERC721(_loans[loanId].collateral.tokenAddress).transferFrom(address(this), msg.sender, _loans[loanId].collateral.tokenId);
    _auctionManager.list(loanId, _loans[loanId].collateral.tokenAddress, _loans[loanId].collateral.tokenId);

    _loans[loanId].status = LoanStatus.UnderAuction;
  }

  function auctionComplete ( uint256 loanId, uint256 amount ) onlyAuctionManager external {
    require(_loans[loanId].status == LoanStatus.UnderAuction);

    _loans[loanId].liquidatedAmount = amount;
    _loans[loanId].status = LoanStatus.Liquidated;
  }

  function cancelLoan ( uint256 loanId ) external {
    require(_receiptToken.ownerOf(loanId) == msg.sender);
    require(_loans[loanId].status == LoanStatus.Requested);
    require(_isBiddingOver(loanId) == true);
    require(_bidsManager.isLoanFulfilled(loanId) == false);

    IERC721(_loans[loanId].collateral.tokenAddress).transferFrom(address(this), msg.sender, _loans[loanId].collateral.tokenId);
    _receiptToken.burn(loanId);
    _loans[loanId].status = LoanStatus.Cancelled;
  }

  function isCreditTransferAllowed ( uint256 bidId ) external view {
    (uint256 loanId,, uint256 amount) = _bidsManager.getBid(bidId);
    require(_isBiddingOver(loanId));

    uint256 returnAmount = _bidsManager.getBidReturnAmount(bidId);
    uint256 availableBalance = _creditToken.balanceOf(msg.sender, bidId);
    require(amount - returnAmount >= availableBalance);
  }

  function isReceiptTransferAllowed ( uint256 loanId ) external view {
    require(_isBiddingOver(loanId));
    require(_loans[loanId].status == LoanStatus.Collected);
  }

  function getLoanDetails ( uint256 loanId ) external view returns (Loan memory loan) {
    loan = _loans[loanId];
  }

  function getBidDetailsForLoan ( address user, uint256 loanId ) external view returns (uint256, uint256, uint256) {
    if ( _bids[user][loanId] == 0 ) return (0, 0, 0);

    (, uint256 premium, uint256 amount) = _bidsManager.getBid(_bids[user][loanId]);
    return (_bids[user][loanId], premium, amount);
  }

  function getBidDetails ( uint256 bidId ) external view returns (uint256, uint256, uint256) {
    return _bidsManager.getBid(bidId);
  }

  function _calculateRepayAmount(uint256 loanId) internal view returns (uint256) {
    uint256 compoundedPrincipal = _calculateCompoundedPrincipal(
      _loans[loanId].principal,
      _loans[loanId].startAaveDebtIndex,
      _aavePool.getReserveNormalizedVariableDebt(address(_ghoToken))
    ) + 1;
    
    uint256 premiumInterest = _calculatePremiumInterest(
      _bidsManager.getLoanPremiumIndex(loanId),
      _loans[loanId].collectTimestamp,
      _loans[loanId].requestTimestamp,
      block.timestamp,
      _loans[loanId].expiry
    ) + 1;

    return compoundedPrincipal + premiumInterest;
  }

  function _calculateLenderShare(uint256 loanId, uint256 premium, uint256 principal) internal view returns (uint256) {
    uint256 compoundedPrincipal = _calculateCompoundedPrincipal(
      principal,
      _loans[loanId].startAaveDebtIndex,
      _loans[loanId].endAaveDebtIndex > 0 ? _loans[loanId].endAaveDebtIndex :
        _aavePool.getReserveNormalizedVariableDebt(address(_ghoToken))
    );

    uint256 premiumInterest = _calculatePremiumInterest(
      _calculatePremiumIndex(principal, premium),
      _loans[loanId].collectTimestamp,
      _loans[loanId].requestTimestamp,
      _loans[loanId].repayTimestamp > 0 ? _loans[loanId].repayTimestamp : block.timestamp,
      _loans[loanId].expiry
    );

    return compoundedPrincipal + premiumInterest;
  }

  function _calculateCompoundedPrincipal(uint256 principal, uint256 startIndex, uint256 currentIndex) internal pure returns (uint256) {
    return ((principal * currentIndex) / startIndex);
  }

  function _calculatePremiumInterest(uint256 premiumIndex, uint256 collectTimestamp, uint256 requestTimestamp, uint256 endTimestamp, uint256 expiry) internal pure returns (uint256) {
    uint256 premiumCalcTimestamp;
    if ( collectTimestamp < requestTimestamp + 1 days ) {
      premiumCalcTimestamp = collectTimestamp;
    } else {
      premiumCalcTimestamp = requestTimestamp + 1 days;
    }

    return ((premiumIndex * (endTimestamp - premiumCalcTimestamp)) / expiry) / 1e9;
  }

  function _calculatePremiumIndex(uint256 principal, uint256 rate) internal pure returns (uint256) {
    return ((principal / 1e16) * (rate / 1e26)) * 1e24;
  }
}