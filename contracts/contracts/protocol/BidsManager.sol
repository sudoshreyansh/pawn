// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

contract BidsManager {
  struct Bid {
    uint256 amount;
    uint256 premium;
    uint256 next;
  }

  uint256 _counter;
  address _poolAddress;

  mapping(uint256 => uint256) internal _firstBids;
  mapping(uint256 => Bid) internal _bids;

  modifier onlyPool() {
    require(msg.sender == _poolAddress);
    _;
  }

  // event BidPlaced(address indexed bidder, uint256 indexed loanId, uint256 indexed bidId, uint256 premium, uint256 amount);

  constructor(address poolAddress_) {
    _counter = 1;
    _poolAddress = poolAddress_;
  }

  function placeBid(uint256 loanId, uint256 amount, uint256 premium) onlyPool external returns (uint256) {
    uint256 nextBid = _firstBids[loanId];
    uint256 previousBid = 0;

    while ( nextBid != 0 ) {
      if ( _bids[nextBid].premium > premium ) {
        break;
      }

      previousBid = nextBid;
      nextBid = _bids[nextBid].next;
    }

    uint256 bidId = _counter;
    _bids[bidId] = Bid(amount, premium, nextBid);
    if ( previousBid != 0 ) _bids[previousBid].next = bidId;
    else _firstBids[loanId] = bidId;

    _counter++;

    return bidId;
  }
}