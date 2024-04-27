// node create project
npm init

// add dependencies
// for compilation with solc
https://docs.soliditylang.org/en/develop/installing-solidity.html
npm install -g solc

// for deployment
npm i web3
npm i ethereumjs-tx@latest
npm i ethers
npm i fs-extra

// install ganache cli
npm install --save-dev ganache

// start ganache private blockchain
npx ganache --deterministic --account_keys_path accounts.json

// task list
1. Create smart contract .sol file 
    examples: braude1.sol (basic), broude2.sol (ERC20)
2. Compile the smart contract  
    example: solcjs braude1.sol --bin --abi --optimize -o build    
3. Deploy in Ganache
    example: dep1.js
4. Deploy in ETH testnet (Goerli)
    example: dep2.js
