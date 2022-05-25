// SPDX-License-Identifier: MIT
pragma solidity >=0.8.13;

contract VotingContract{

    address public owner;

    modifier onlyOwner{
        require(msg.sender == owner, "only owner");
        _;
    }
    constructor(){
        owner = msg.sender;
    }

    struct Vote {
        uint256 balance;
        uint256 endAt;
        uint256 maxVotes;
        bool ended;
        address leader; //winner if vote ended
        address[] proposals;
        mapping(address => uint) voteCount;
        mapping(address => bool) isVoted;
    }

    mapping(uint => Vote) public votings;
    uint public voteAmount;

    function createVote(address[] calldata proposalNames) external onlyOwner {
        Vote storage _vote = votings[voteAmount++];
        _vote.proposals = proposalNames;
        _vote.endAt = block.timestamp + 3 days;
    }
    function addProposals(address[] calldata proposalNames, uint voteId) external onlyOwner {
        Vote storage _vote = votings[voteId];
        uint _length = proposalNames.length;
        for (uint256 i = 0; i < _length; ++i){
            _vote.proposals.push(proposalNames[i]);
        }
    }
    function vote(uint voteId, uint proposalId) external payable {
        require(msg.value == 0.01 ether, "deposit != 0.01 eth");
        Vote storage _vote = votings[voteId];
        require(block.timestamp < _vote.endAt, "ended");
        require(!_vote.isVoted[msg.sender], "already voted");
        require(proposalId < _vote.proposals.length, "wrong Id");
        _vote.isVoted[msg.sender] = true;
        _vote.voteCount[ _vote.proposals[proposalId]]++;
        _vote.balance += msg.value;
        if (_vote.voteCount[_vote.proposals[proposalId]] > _vote.maxVotes){
            _vote.leader = _vote.proposals[proposalId];
            _vote.maxVotes += 1;
        }
    }
    function end(uint voteId) external{
        Vote storage _vote = votings[voteId];
        require(block.timestamp >= _vote.endAt, "not ended");
        require(!_vote.ended, "already ended");
        _vote.ended = true;

        uint _balance = _vote.balance * 90 / 100;
        payable(_vote.leader).transfer(_balance);
        _vote.balance -= _balance;
    }
    function withdrawal(uint voteId) external onlyOwner{
        Vote storage _vote = votings[voteId];
        require(_vote.ended, "not ended");
        payable(owner).transfer(_vote.balance);
        _vote.balance = 0;
    }


    function getVoteCount(uint voteId, address proposal) external view returns(uint){
        return votings[voteId].voteCount[proposal];
    }
    function isEnded(uint voteId) external view returns(bool){
        return votings[voteId].ended;
    }
    function voteBalance(uint voteId) external view returns(uint){
        return votings[voteId].balance;
    }
    function getLeader(uint voteId) external view returns(address){
        return votings[voteId].leader;
    }
    function getProposals(uint voteId) external view returns(address[] memory){
        return votings[voteId].proposals;
    }
    function getMaxVotes(uint voteId) external view returns(uint){
        return votings[voteId].maxVotes;
    }
}
