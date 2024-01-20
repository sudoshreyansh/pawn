// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../base/OnlyPool.sol";
import "../interfaces/IReceiptToken.sol";

contract ReceiptToken is OnlyPool, ERC721, IReceiptToken {
  constructor( address poolAddress_ )
    OnlyPool(poolAddress_)
    ERC721("Pawn Loan Receipt", "PLR") {}

  function mint(uint256 loanId, address loanRecipient) onlyPool external {
    _mint(loanRecipient, loanId);
  }

  function burn(uint256 loanId) onlyPool override external {
    _burn(loanId);
  }

  // metadata
  // transfer should update pool too
}