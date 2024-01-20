// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "../base/OnlyPool.sol";
import "../interfaces/IPawnPool.sol";
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
    _items[loanId] = Item(tokenAddress, tokenId, block.timestamp, 0, 0, address(0));
    emit NewToken(loanId, tokenAddress, tokenId);
  }

  function bid(uint256 loanId, uint256 amount) external {
    Item memory item = _items[loanId];

    require(item._address != address(0));
    require(block.timestamp >= item._listTimestamp + 1 days);
    require(amount > item._lastBidAmount);

    if ( item._lastBidTimestamp > 0 )
      require(block.timestamp <= item._lastBidTimestamp + 1 hours);
    
    _ghoToken.transferFrom(msg.sender, address(this), amount);
    _ghoToken.transfer(item._lastBidAddress, item._lastBidAmount);

    _items[loanId]._lastBidAddress = msg.sender;
    _items[loanId]._lastBidAmount = amount;
    _items[loanId]._lastBidTimestamp = block.timestamp;
  }

  function claim(uint256 loanId) external {
    Item memory item = _items[loanId];

    require(item._lastBidAddress == msg.sender);
    require(block.timestamp > item._lastBidTimestamp + 1 hours);

    IERC721(item._address).transferFrom(address(this), msg.sender, item._id);
    _ghoToken.transfer(_poolAddress, item._lastBidAmount);
    IPawnPool(_poolAddress).auctionComplete(loanId, item._lastBidAmount);

    delete _items[loanId];
  }
}