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
        bool ended;
        address winner;
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

    function vote(uint voteId, uint proposalId) external payable {
        require(msg.value == 0.01 ether, "deposit != 0.01 eth");
        Vote storage _vote = votings[voteId];
        require(block.timestamp < _vote.endAt, "ended");
        require(!_vote.isVoted[msg.sender], "already voted");
        require(proposalId < _vote.proposals.length, "wrong Id");
        _vote.isVoted[msg.sender] = true;
        _vote.voteCount[ _vote.proposals[proposalId]]++;
        _vote.balance += msg.value;

    }
    function end(uint voteId) external{
        Vote storage _vote = votings[voteId];
        require(block.timestamp >= _vote.endAt, "not ended");
        require(!_vote.ended, "already ended");
        _vote.ended = true;
        uint _winner;
        uint maxVotes;
        uint votes;
        uint len = _vote.proposals.length;
        for (uint i = 0; i < len; ++i){
            votes = _vote.voteCount[_vote.proposals[i]];
            if (votes > maxVotes){
                maxVotes = votes;
                _winner = i;
            }
        }
        uint _balance = _vote.balance * 90 / 100;
        _vote.winner = _vote.proposals[_winner];
        payable(_vote.proposals[_winner]).transfer(_balance);
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
    function getWinner(uint voteId) external view returns(address){
        require(votings[voteId].ended, "not ended");
        return votings[voteId].winner;
    }
    function getProposals(uint voteId) external view returns(address[] memory){
        return votings[voteId].proposals;
    }

}
