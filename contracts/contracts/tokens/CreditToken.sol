// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "../base/OnlyPool.sol";
import "../interfaces/ICreditToken.sol";
import "../interfaces/IPawnPool.sol";

contract CreditToken is OnlyPool, ERC1155, ICreditToken {
  constructor( address poolAddress_ ) OnlyPool(poolAddress_) ERC1155("") {}

  function mint(address recipient, uint256 bidId, uint256 amount) onlyPool external {
    _mint(recipient, bidId, amount, "");
  }

  function burn(address recipient, uint256 bidId, uint256 amount) onlyPool external {
    _burn(recipient, bidId, amount);
  }

  function safeTransferFrom(address from, address to, uint256 id, uint256 value, bytes memory data) public override(ERC1155, IERC1155) {
    IPawnPool(_poolAddress).isCreditTransferAllowed(id);
    super.safeTransferFrom(from, to, id, value, data);
  }
}