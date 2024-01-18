// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

interface IReceiptToken {
  function mint(uint256 loanId, address loanRecipient) external;
  function burn(uint256 loanId) external;
}