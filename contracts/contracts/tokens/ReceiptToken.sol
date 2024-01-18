// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/IReceiptToken.sol";

contract ReceiptToken is Ownable, ERC721, IReceiptToken {
  address internal _poolAddress;

  modifier onlyPool() {
    require(msg.sender == _poolAddress);
    _;
  }

  constructor(
    address poolAddress_
  ) Ownable(msg.sender) ERC721("Pawn Loan Receipt", "PLR") {
    _poolAddress = poolAddress_;
  }

  function setPoolAddress(address poolAddress_) onlyOwner external {
    _poolAddress = poolAddress_;
  }

  function mint(
    uint256 loanId,
    address loanRecipient
  ) onlyPool external {
    _mint(loanRecipient, loanId);
  }

  function burn(
    uint256 loanId,
    address underlyingTokenAddress,
    uint256 underlyingTokenId,
    address underlyingRecipient
  ) onlyPool external {
    IERC721(underlyingTokenAddress).safeTransferFrom(address(this), underlyingRecipient, underlyingTokenId);
    _burn(loanId);
  }

  // metadata
  // transfer should update pool too
}