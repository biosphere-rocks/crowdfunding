require('dotenv').config();
const IPFS = require('ipfs-http-client');
const fs = require('fs');
const Web3 = require('web3');
const contractAbi = require('./build/contracts/NFTContract.json').abi;

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.RPC_URL));
const ipfs = IPFS.create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

async function generateNFTs() {
    const accounts = await web3.eth.getAccounts();
    const contractAddress = process.env.CONTRACT_ADDRESS;
    const contract = new web3.eth.Contract(contractAbi, contractAddress);

    for (let i = 0; i < 30; i++) {
        const tokenId = i + 1;
        const imageFilePath = `./images/image${tokenId}.jpg`; // Ruta de la imagen que quieres vincular al NFT

        const metadata = {
            name: `NFT ${tokenId}`,
            description: 'This is an example NFT',
            image: '',
        };

        const imageFile = fs.readFileSync(imageFilePath);
        const imageBuffer = Buffer.from(imageFile);

        const uploadedImage = await ipfs.add(imageBuffer);
        const imageURI = `ipfs://${uploadedImage.path}`;

        metadata.image = imageURI;

        const metadataString = JSON.stringify(metadata);
        const metadataFile = await ipfs.add(metadataString);
        const metadataURI = `ipfs://${metadataFile.path}`;

        console.log(`Minting NFT ${tokenId}`);
        await contract.methods
            .mintNFT(accounts[0], metadataURI)
            .send({ from: accounts[0], value: web3.utils.toWei('1', 'ether') });
    }
}

generateNFTs()
    .then(() => console.log('NFT generation completed.'))
    .catch((error) => console.error('Error generating NFTs:', error));
