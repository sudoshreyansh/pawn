// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IReceiptToken is IERC721 {
  function mint(uint256 loanId, address loanRecipient) external;
  function burn(uint256 loanId) external;
}