// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NftMsg is ERC721, ERC721URIStorage, ERC721Enumerable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    //set NFT Name and Symbol
    constructor() ERC721("NFTmsg", "NMSG") {}

    //set a base URI to be add in URIs
    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://";
    }

    //mint a NFT message for free
    function safeMint(address _to, string memory _uri)
        public
        returns (uint256)
    {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(_to, tokenId);
        _setTokenURI(tokenId, _uri);
        return tokenId;
    }

    //mint a NFT, paying for it
    function specialMint(address _to, string memory _uri)
        public
        payable
        returns (uint256)
    {
        require(msg.value >= 0.001 ether, "Need to pay up!");

        uint256 newItemId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _mint(_to, newItemId);
        _setTokenURI(newItemId, _uri);

        return newItemId;
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
