// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

contract VotingContract{

  address public owner;
  modifier onlyOwner{
      require(msg.sender == owner, "only owner");
      _;
  }
  constructor(){
      owner = msg.sender;
  }


   struct Proposal {
          address name;
          uint voteCount; 
    }

  struct Vote {
    mapping(address => uint) voteCount;
    mapping(address => bool) isVoted;
    mapping(address => bool) isProposal;
    address winner;
    bool ended;
    uint endAt;
    Proposal[] proposals;
    uint balance;
  }
  Vote[] public votings;


  function createVote(address[] memory proposalNames) public onlyOwner{
      Vote storage newVote = votings.push();
      newVote.endAt =  block.timestamp + 3 days;
      for (uint i = 0; i < proposalNames.length; i++){
          newVote.isProposal[proposalNames[i]] = true;
          newVote.proposals.push(Proposal({
              name: proposalNames[i],
              voteCount : 0
          }));
      }
  }

  function vote(uint votingNumber, address proposal) external payable{
      require(msg.value == 10000000000000000, "deposit != 0.01 eth");
      require(block.timestamp < votings[votingNumber].endAt, "ended");
      require(!votings[votingNumber].isVoted[msg.sender], "already voted");
      require(!votings[votingNumber].isProposal[msg.sender], "Proposals cant vote");
      require(votings[votingNumber].isProposal[proposal], "not proposal");
      votings[votingNumber].isVoted[msg.sender] = true;
      votings[votingNumber].voteCount[proposal] += 1;
      votings[votingNumber].balance += msg.value;
  }
  function end(uint votingNumber) external{
    require(block.timestamp >= votings[votingNumber].endAt, "not ended");
    require(!votings[votingNumber].ended, "already ended");
    votings[votingNumber].ended = true;
    address _winner;
    uint maxVotes;
    uint votes;
    for (uint i = 0; i < votings[votingNumber].proposals.length; i++){
        votes = votings[votingNumber].voteCount[votings[votingNumber].proposals[i].name];
        if (votes > maxVotes){
            maxVotes = votes;
            _winner = votings[votingNumber].proposals[i].name;
        }
    }
    votings[votingNumber].winner = _winner; 
    payable(_winner).transfer(votings[votingNumber].balance * 90 / 100);
    votings[votingNumber].balance -= votings[votingNumber].balance * 90 / 100;
  }
  function withdrawal(uint votingNumber) external onlyOwner{
      require(votings[votingNumber].ended, "not ended");
      payable(owner).transfer(votings[votingNumber].balance);
      votings[votingNumber].balance = 0;
  }

  function getVoteCount(uint votingNumber, address proposal) external view returns(uint){
      return votings[votingNumber].voteCount[proposal];
  }
  function isEnded(uint votingNumber) external view returns(bool){
      return votings[votingNumber].ended;
  }
  function voteBalance(uint votingNumber) external view returns(uint){
      return votings[votingNumber].balance;
  }
  function getWinner(uint votingNumber) external view returns(address){
      require(votings[votingNumber].ended, "not ended");
      return votings[votingNumber].winner;
  }
  function getProposals(uint votingNumber) external view returns(address[] memory){
      address[] memory _addresses = new address[](votings[votingNumber].proposals.length);
      for (uint i = 0; i < votings[votingNumber].proposals.length; i++){
        _addresses[i] = votings[votingNumber].proposals[i].name;
    }
      return _addresses;
  }

}
