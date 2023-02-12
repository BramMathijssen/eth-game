# EthGame 
This is a little game where everyone can deposit ETH to a smart contract where the 14th person depositing wins all the funds inside the contract.

![EthGame Dashboard](./ethgame-frontend/public/ethGame.jpg)


## Techstack 
This dapp is built using Next.js, Hardhat and Ethers, currently the dapp is built to work on the Hardhat local network. 

## Techniques Used

### Front-end
- Context API to store the UI State and Ethers connection
- SCSS + CSS Modules for styling
- Listening to events from the contract by using the .on() function, provided by ethers

### Hardhat
- using the hardhat-deploy library, to automatically deploy contracts to the Hardhat Local Network after running hardhat deploy or hardhat node
- Sending the new abi + contract address to the front-end automatically everytime we make an change to the smart contract
- Tests written in mocha + chai matchers
- Hardhat Console used for debugging the smart contract