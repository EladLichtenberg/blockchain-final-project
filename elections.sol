// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract Election {
    
    struct Voter {
        uint counter; //counts a vote of the voter
        bool voted; // if true, that person already voted
        uint indexOfVote; // index of the voted competitor
    }

    struct Competitor {
        bytes32 name; // name of the contenders
        uint voteCount; // number of accumulated votes
    }

    address public director; //(this is the admin)
    mapping(address => Voter) public voters;
    Competitor[] public competitors;

    constructor(bytes32[] memory competitorNames) { //on deploy, we send the names of the competitors for the election
        director = msg.sender;
        voters[director].counter = 1;
        
        for (uint i = 0; i < competitorNames.length; i++) { //new competitor object for each name
            competitors.push(Competitor({name: competitorNames[i], voteCount: 0}));
        }
    }

   
    function giveRightToVote(address voter) external { // Give `voter` the right to vote on this election by the director (admin)
        require(
            msg.sender == director,
            "Only director can give right to vote."
        );
        require(!voters[voter].voted, "The voter already voted.");
        require(voters[voter].counter == 0); //if a voter did not vote yet, give him an amount
        voters[voter].counter = 1;
    }

    function vote(uint competitor) external { //the action of voting for competitor
        Voter storage sender = voters[msg.sender];
        require(sender.counter != 0, "Has no right to vote");
        require(!sender.voted, "Already voted.");
        sender.voted = true;
        sender.indexOfVote = competitor;
        competitors[competitor].voteCount += sender.counter; //add the voters vote amount 
    }

    function winningCompetitor() public view returns (uint index) { //gets and index of who won the election
        uint winnerVoteCount = 0;
        for (uint i = 0; i < competitors.length; i++) {
            if (competitors[i].voteCount > winnerVoteCount) {
                winnerVoteCount = competitors[i].voteCount;
                index = i;
            }
        }
    }

    function winnerName() external view returns (bytes32 name) { //returns the name of the person that won the election using the function above
        name = competitors[winningCompetitor()].name;
    }
}
