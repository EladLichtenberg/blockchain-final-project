import Web3 from 'web3'
import fs from 'fs-extra'

const web3 = new Web3('http://localhost:8545') // Connect to the Ganache blockchain

const privateKey = '0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d' // Your private key
const account = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1' // Your account address

const bytecode = fs.readFileSync('./build/elections_sol_Election.bin')
const abi = JSON.parse(fs.readFileSync('./build/elections_sol_Election.abi')) // ABI of your contract

const competitorNames = [
    web3.utils.asciiToHex('Ben'),
    web3.utils.asciiToHex('Hani')
];

//send competitor names for the election
const contract = new web3.eth.Contract(abi)
const deploy = contract.deploy({
    data: '0x' + bytecode,
    arguments: [competitorNames]
})

const deployTransaction = deploy.encodeABI()

web3.eth.getTransactionCount(account, async (err, nonce) => {
    // Prepare the contract deployment transaction
    //const data = '0x' + bytecode
    const txParams = {
        nonce: web3.utils.toHex(nonce),
        gasPrice: web3.utils.toHex(web3.utils.toWei('20', 'gwei')),
        gasLimit: web3.utils.toHex(6000000),
        from: account,
        data: deployTransaction
    }
    // Sign the transaction
    const signedTx = await web3.eth.accounts.signTransaction(txParams, privateKey)
    const rawTx = signedTx.rawTransaction
    // Send the transaction
    web3.eth.sendSignedTransaction(rawTx)
        .on('receipt', receipt => {
            console.log(receipt)
        }).catch(err => {
            console.log(err)
        })
})

// token address: 0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab



