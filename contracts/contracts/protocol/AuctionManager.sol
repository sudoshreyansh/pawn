// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "../base/OnlyPool.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract AuctionManager is OnlyPool {
  struct Item {
    address _address;
    uint256 _id;
    uint256 _listTimestamp;
    uint256 _lastBidAmount;
    uint256 _lastBidTimestamp;
    address _lastBidAddress;
  }

  mapping (uint256 => Item) _items;
  IERC20 _ghoToken;

  event NewToken(uint256 loanId, address tokenAddress, uint256 tokenId);
  event NewBid(uint256 );

  constructor(address poolAddress_, address ghoTokenAddress_) OnlyPool(poolAddress_) {
    _ghoToken = IERC20(ghoTokenAddress_);
  }

  function list(uint256 loanId, address tokenAddress, uint256 tokenId) onlyPool external {
    _items[loanId] = Item(tokenAddress, tokenId, block.timestamp, 0, 0, 0);
    emit NewToken(loanId, tokenAddress, tokenId);
  }

  function bid(uint256 loanId, uint256 amount) external {
    require(_items[loanId]._address != address(0));
    require(block.timestamp >= _items[loanId]._listTimestamp + 1 days);
    require(amount > _items[loanId]._lastBidAmount);
    if ( _items[loanId]._lastBidTimestamp > 0 )
      require(block.timestamp <= _items[loanId]._lastBidTimestamp + 1 hours);
    
    _ghoToken.transferFrom(msg.sender, address(this), amount);
    _ghoToken.transfer(_items[loanId]._lastBidAddress, _items[loanId]._lastBidAmount);

    _items[loanId]._lastBidAddress = msg.sender;
    _items[loanId]._lastBidAmount = amount;
    _items[loanId]._lastBidTimestamp = block.timestamp;
  }

  function claim(uint256 loanId) external {
    require(_items[loanId]._lastBidAddress == msg.sender);
    require(block.timestamp > _items[loanId]._lastBidTimestamp + 1 hours);

    IERC721(_items[loanId]._address).transferFrom(address(this), msg.sender, _items[loanId]._id);
    _ghoToken.transfer(_poolAddress, _items[loanId]._lastBidAmount);
    _IPawnPool(_poolAddress).auctionComplete(loanId, _items[loanId]._lastBidAmount);

    delete _items[loanId];
  }
}