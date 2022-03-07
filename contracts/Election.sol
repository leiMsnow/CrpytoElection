// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.4.22 <0.9.0;

contract Election {
    struct Candidate {
        string name;
        uint256 id;
        uint256 voteCount;
    }

    mapping(address => bool) public voters;
    mapping(uint256 => Candidate) public candidates;

    uint256 public candidatesCount;

    event voteEvent(uint256 indexed _candidateId);

    constructor() public {
        addCandidate("Alice");
        addCandidate("Bob");
        addCandidate("Ray");
    }

    function addCandidate(string memory _name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(_name, candidatesCount, 0);
    }

    function vote(uint256 _candidateId) public {
        require(!voters[msg.sender]);
        require(_candidateId > 0 && _candidateId <= candidatesCount);
        voters[msg.sender] = true;
        candidates[_candidateId].voteCount++;
        emit voteEvent(_candidateId);
    }
}
