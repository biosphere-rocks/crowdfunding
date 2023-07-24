// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTContract is ERC721, Ownable {
    uint256 private commissionPercentage = 5;

    constructor() ERC721("MyNFT", "NFT") {}

    function mintNFT(address recipient, string memory tokenURI) external payable {
        require(msg.value >= calculateCommission(msg.value), "Insufficient funds");

        uint256 tokenId = totalSupply() + 1;
        _safeMint(recipient, tokenId);
        _setTokenURI(tokenId, tokenURI);

        address payable creator = payable(owner());
        creator.transfer(msg.value - calculateCommission(msg.value));
    }

    function calculateCommission(uint256 amount) internal view returns (uint256) {
        return (amount * commissionPercentage) / 100;
    }
}
