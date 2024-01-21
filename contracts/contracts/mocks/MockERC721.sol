// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MockERC721 is ERC721 {
    constructor() ERC721("PawnERC721", "PNFT") {
    }

    function mint(uint256 id) external {
      _mint(msg.sender, id);
    }

    function _baseURI() internal view override returns (string memory) {
        return "ipfs://Qme9oknaXLAvFsGQRv1YqfnYYutLDouu7wyjyp9aYV59N5/";
    }
}