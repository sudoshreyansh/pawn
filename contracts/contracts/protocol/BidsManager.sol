// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "../interfaces/IBidsManager.sol";

contract BidsManager is IBidsManager {
  struct Loan {
    uint112 requestedAmount;
    uint16 maxPremium;
    uint112 cummulativeBidAmount;
    uint256 lastAcceptedBidId;
    uint256 cummulativePremiumIndex;
    uint256[2] bidBitmasks;
  }

  struct BidBucket {
    uint128 loan;
    uint16 premium;
    uint112 liquidity;
  }

  mapping(uint128 => Loan) _loans;
  mapping(uint128 => mapping(uint16 => BidBucket)) _bidBuckets;
  mapping(uint256 => uint112) _bidAmounts;

  address _poolAddress;

  modifier onlyPool() {
    require(msg.sender == _poolAddress);
    _;
  }

  // event BidPlaced(address indexed bidder, uint256 indexed loanId, uint256 indexed bidId, uint256 premium, uint256 amount);

  constructor(address poolAddress_) {
    _poolAddress = poolAddress_;
  }

  function initializeLoan(uint256 loanId, uint256 amount, uint256 maxPremium) external {
    uint128 transformedLoanId = _transformLoanId(loanId);
    uint112 transformedAmount = _transformAmount(amount);
    uint16 transformedMaxPremium = _transformPremium(maxPremium);

    _loans[transformedLoanId] = Loan(
      transformedAmount,
      transformedMaxPremium,
      0,
      0,
      0,
      [uint256(0), uint256(0)]
    );
  }

  function placeBid(uint256 loanId, uint256 amount, uint256 premium) onlyPool external returns (uint256) {
    uint128 loanId_ = _transformLoanId(loanId);
    uint112 amount_ = _transformAmount(amount);
    uint16 premium_ = _transformPremium(premium);

    uint112 bucketLiquidity = _bidBuckets[loanId_][premium_].liquidity;
    uint256 bidId = _bidId(loanId_, premium_, bucketLiquidity);

    if ( bucketLiquidity == 0 ) {
      _loans[loanId_].bidBitmasks[premium_ / 256] &= (uint256(1) << premium_ % 256);
    }

    _bidBuckets[loanId_][premium_].liquidity += amount_;
    _loans[loanId_].cummulativeBidAmount += amount_;

    uint256 lastBidId = _loans[loanId_].lastAcceptedBidId;
    if ( lastBidId == 0 || bidId < lastBidId ) {
      _loans[loanId_].cummulativePremiumIndex += amount_ * premium_;
    }

    if ( lastBidId == 0 ) {
      if ( _loans[loanId_].cummulativeBidAmount >= _loans[loanId_].requestedAmount ) {
        _shiftLastAcceptBidId(loanId_, _loans[loanId_].cummulativeBidAmount - _loans[loanId_].requestedAmount);
      }
    } else if ( bidId < lastBidId ) {
      _shiftLastAcceptBidId(loanId_, amount_);
    }

    return bidId;
  }
  
  function getBidReturnAmount(uint256 bidId) view external returns (uint256) {
    (uint128 loanId, uint16 premium, uint112 bidStart) = _extractFromBidId(bidId);
    uint256 lastAcceptedBidId = _loans[loanId].lastAcceptedBidId;
    uint112 amountToReturn;

    if ( lastAcceptedBidId == 0 || lastAcceptedBidId <= bidId ) {
      amountToReturn = _bidAmounts[bidId];
    } else {
      uint112 bidAmount = _bidAmounts[bidId];
      (, uint16 lastAcceptedPremium, uint112 lastAcceptedBidStart) = _extractFromBidId(lastAcceptedBidId);

      if ( premium != lastAcceptedPremium ) {
        amountToReturn = bidAmount;
      } else {
        uint112 bidSpread = lastAcceptedBidStart - bidStart;

        if ( bidSpread > bidAmount ) amountToReturn = bidAmount;
        else amountToReturn = bidSpread;
      }
    }

    return uint256(amountToReturn) * 1e16;
  }

  function getBid(uint256 bidId) external view returns (uint256, uint256, uint256) {
    (uint128 loanId, uint16 premium,) = _extractFromBidId(bidId);
    uint112 amount = _bidAmounts[bidId];

    return (uint256(loanId), uint256(premium) * 1e26, uint256(amount) * 1e16);
  }

  function getLoanPremiumIndex(uint256 loanId) view external returns (uint256) {
    return (_loans[uint128(loanId)].cummulativePremiumIndex * 1e24);
  }

  function isLoanFulfilled(uint256 loanId) view external returns (bool) {
    return _loans[uint128(loanId)].cummulativeBidAmount >= _loans[uint128(loanId)].requestedAmount;
  }

  function _transformLoanId ( uint256 id ) pure internal returns (uint128) {
    return uint128(id);
  }

  function _transformAmount ( uint256 amount ) pure internal returns (uint112) {
    require((amount * 100) % 1e18 == 0);
    return uint112((amount * 100) / 1e18);
  }

  function _transformPremium ( uint256 premium ) pure internal returns (uint16) {
    require((premium * 10) % 1e27 == 0);
    uint16 transformedPremium = uint16((premium * 10) / 1e27);
    require(transformedPremium <= 500);

    return transformedPremium;
  }

  function _extractFromBidId ( uint256 bidId ) pure internal returns (uint128, uint16, uint112) {
    uint112 amount = uint112(bidId);
    uint16 premium = uint16(bidId >> 112);
    uint128 loanId = uint128(bidId >> 128);

    return (loanId, premium, amount);
  }

  function _bidId ( uint128 loanId, uint16 premium, uint112 amount ) pure internal returns (uint256) {
    uint256 bidId = uint256(loanId);
    bidId = bidId << 128;
    bidId = bidId | amount;
    bidId = bidId | (premium << 112);
    return bidId;
  }

  function _shiftLastAcceptBidId ( uint128 loanId, uint112 amount ) internal {
    uint256[2] memory bidMask = _loans[loanId].bidBitmasks;
    uint256 lastAcceptedBidId = _loans[loanId].lastAcceptedBidId;
    uint16 lastBucketIndex;
    uint112 lastBucketExcessAmount;
    uint256 premiumIndexToRemove = 0;
    
    if ( lastAcceptedBidId == 0 ) {
      lastBucketIndex = _loans[loanId].maxPremium;
      lastBucketExcessAmount = 0;
    } else {
      lastBucketIndex = uint16(lastAcceptedBidId >> 112);
      lastBucketExcessAmount = _bidBuckets[loanId][lastBucketIndex].liquidity - uint112(lastAcceptedBidId);
    }

    while ( lastBucketIndex >= 0 ) {
      if ( bidMask[lastBucketIndex / 256] & (uint256(1) << (lastBucketIndex % 256)) > 0 ) {
        uint112 amountAvailableToRemove = _bidBuckets[loanId][lastBucketIndex].liquidity - lastBucketExcessAmount;
        if ( amountAvailableToRemove > amount ) {
          premiumIndexToRemove += amount * _bidBuckets[loanId][lastBucketIndex].premium;
          lastBucketExcessAmount = amount + lastBucketExcessAmount;
          break;
        }

        premiumIndexToRemove += amountAvailableToRemove * _bidBuckets[loanId][lastBucketIndex].premium;
        amount -= amountAvailableToRemove;
        lastBucketExcessAmount = 0;
      }

      lastBucketIndex--;
    }

    _loans[loanId].lastAcceptedBidId = _bidId(loanId, lastBucketIndex, _bidBuckets[loanId][lastBucketIndex].liquidity - lastBucketExcessAmount);
    _loans[loanId].cummulativePremiumIndex -= premiumIndexToRemove;
  }
}