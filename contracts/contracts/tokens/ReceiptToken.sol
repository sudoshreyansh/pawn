// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "../base/OnlyPool.sol";
import "../interfaces/IReceiptToken.sol";
import "../interfaces/IPawnPool.sol";

contract ReceiptToken is OnlyPool, ERC721Enumerable, IReceiptToken {
  struct LoanUI {
    uint256 id;
    IPawnPool.LoanStatus status;
    IPawnPool.Asset collateral;
    uint256 principal;
    uint256 maxPremium;
    uint256 expiry;
    uint256 requestTimestamp;
  }

  struct BidUI {
    uint256 id;
    uint256 premium;
    uint256 amount;
  }

  constructor( address poolAddress_ )
    OnlyPool(poolAddress_)
    ERC721("Pawn Loan Receipt", "PLR") {}

  function mint(uint256 loanId, address loanRecipient) onlyPool external {
    _mint(loanRecipient, loanId);
  }

  function burn(uint256 loanId) onlyPool override external {
    _burn(loanId);
  }

  function transferFrom(address from, address to, uint256 tokenId) public override(ERC721, IERC721) {
    IPawnPool(_poolAddress).isReceiptTransferAllowed(tokenId);
    super.transferFrom(from, to, tokenId);
  }

  function getDetailsForUser(address user, uint256 tokenIndex) external view returns (LoanUI memory) {
    uint256 tokenId = super.tokenOfOwnerByIndex(user, tokenIndex);
    IPawnPool.Loan memory loan = IPawnPool(_poolAddress).getLoanDetails(tokenId);
    
    return LoanUI(
      tokenId,
      loan.status,
      loan.collateral,
      loan.principal,
      loan.maxPremium,
      loan.expiry,
      loan.requestTimestamp
    );
  }

  function getDetailsForMarket(uint256 tokenIndex) external view returns (LoanUI memory) {
    uint256 tokenId = super.tokenByIndex(tokenIndex);
    IPawnPool.Loan memory loan = IPawnPool(_poolAddress).getLoanDetails(tokenId);
    
    return LoanUI(
      tokenId,
      loan.status,
      loan.collateral,
      loan.principal,
      loan.maxPremium,
      loan.expiry,
      loan.requestTimestamp
    );
  }

  function getDetails(uint256 tokenId) external view returns (LoanUI memory) {
    IPawnPool.Loan memory loan = IPawnPool(_poolAddress).getLoanDetails(tokenId);
    
    return LoanUI(
      tokenId,
      loan.status,
      loan.collateral,
      loan.principal,
      loan.maxPremium,
      loan.expiry,
      loan.requestTimestamp
    );
  }

  function getBidDetailsForUser(address user, uint256 loanId) external view returns (BidUI memory) {
    (uint256 id, uint256 premium, uint256 amount) = IPawnPool(_poolAddress).getBidDetailsForLoan(user, loanId);
    return BidUI(id, premium, amount);
  }

  // metadata
}