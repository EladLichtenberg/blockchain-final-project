import Web3 from 'web3'
import fs from 'fs-extra'

const tokenABI = JSON.parse(fs.readFileSync('./build/elections_sol_Election.abi'))
const contractAddress = "0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab" //place contract address before starting the election
const adminAddress = "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1"    //i chose the first account from ganache to be the admin (director)
const web3 = new Web3('http://localhost:8545')
const ballotContract = new web3.eth.Contract(tokenABI, contractAddress)

const voter1 = "0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0"
const voter2 = "0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b"
const voter3 = "0xE11BA2b4D45Eaed5996Cd0823791E0C93114882d"

async function giveRightToVote(voter) {
    try {
        await ballotContract.methods.giveRightToVote(voter).send({ from: adminAddress, gas: 100000, gasPrice: "10000000000" });
    } catch (error) {
        console.error("Error:", error.message);
        if (error.message.includes("Only chairperson can give right to vote")) {
            console.log("Only chairperson can give right to vote");
        }
    }
}

async function vote(indexNumber) {
    try {
        await ballotContract.methods.giveRightToVote(indexNumber).send({ from: adminAddress, gas: 100000, gasPrice: "10000000000" });
    } catch (error) {
        console.error("Error:", error.message);
        if (error.message.includes("already voted")) {
            console.log("Voter already voted");
        } else if (error.message.includes("has no right to vote")) {
            console.log("Voter has no right to vote");
        }
    }
}

async function start() {
    const winnerIndex = await ballotContract.methods.winningCompetitor().call();
    const winnerName = await ballotContract.methods.winnerName().call();
    const winnerNameAscii = web3.utils.hexToAscii(winnerName);
    console.log(`The winner is, contestant number ${winnerIndex}: ${winnerNameAscii}`);
}



// Example interaction
async function startElection() {
    try {
        // Give voting rights to voters
        await ballotContract.methods.giveRightToVote(voter1).send({ from: adminAddress, gas: 100000, gasPrice: "10000000000" });
        await ballotContract.methods.giveRightToVote(voter2).send({ from: adminAddress, gas: 100000, gasPrice: "10000000000" });
        await ballotContract.methods.giveRightToVote(voter3).send({ from: adminAddress, gas: 100000, gasPrice: "10000000000" });

        // Cast votes: 1 for "Hani", 0 for "Ben"
        await ballotContract.methods.vote(1).send({ from: voter1, gas: 100000, gasPrice: "10000000000" });
        await ballotContract.methods.vote(1).send({ from: voter2, gas: 100000, gasPrice: "10000000000" });
        await ballotContract.methods.vote(0).send({ from: voter3, gas: 100000, gasPrice: "10000000000" });

        //Get winner
        const winnerIndex = await ballotContract.methods.winningCompetitor().call();
        const winnerName = await ballotContract.methods.winnerName().call();
        const winnerNameAscii = web3.utils.hexToAscii(winnerName);
        console.log(`The winner is, contestant number ${winnerIndex}: ${winnerNameAscii}`);
    } catch (error) {
        console.error("Error:", error.message);
        if (error.message.includes("Only chairperson can give right to vote")) {
            console.log("Only chairperson can give right to vote");
        } else if (error.message.includes("already voted")) {
            console.log("Voter already voted");
        } else if (error.message.includes("has no right to vote")) {
            console.log("Voter has no right to vote");
        }
    }
}
startElection()


