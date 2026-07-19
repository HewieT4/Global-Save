// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title GlobalSave - Decentralized Micro-Savings & Shared Expenses on Monad
 * @notice Implements low-cost micro-savings, multi-sig expense verification, 
 *         and community dispute resolution using Monad's 1-second block times.
 *         Includes a 24-hour Veto Payout mechanism to temporarily halt suspicious transactions.
 */
contract GlobalSave {
    
    enum ProposalStatus { 
        PendingSignatures, 
        Approved, 
        FlaggedLocked, 
        Executed, 
        Rejected,
        VetoedPaused
    }

    enum ProposalType {
        Payout,
        AddMember,
        RemoveMember,
        ToggleYield
    }
    
    struct Member {
        address wallet;
        string name;
        uint256 totalContributed;
        uint256 reputationScore;
        bool exists;
    }
    
    struct Proposal {
        uint256 id;
        ProposalType propType;
        string title;
        string description;
        uint256 amount;
        address payable recipient;
        address creator;
        uint8 requiredSignatures;
        uint8 signatureCount;
        ProposalStatus status;
        uint256 createdAt;
        uint256 disputeDeadline;
        uint256 votesApprove;
        uint256 votesReject;
        address flagger;
        bool isVetoed;
        uint256 vetoExpiry;
    }
    
    string public groupName;
    address[] public memberList;
    mapping(address => Member) public members;
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(uint256 => bool)) public proposalSignaturesDummy; // helper
    mapping(uint256 => mapping(address => bool)) public proposalSignatures;
    mapping(uint256 => mapping(address => bool)) public disputeVotes;
    mapping(uint256 => mapping(address => bool)) public proposalVetoers;
    
    uint256 public totalPoolBalance;
    uint256 public proposalCount;
    uint256 public requiredSignaturesCount;
    
    address public constant DEFI_YIELD_VAULT = address(0);
    bool public yieldEnabled;
    bool private locked;
    
    event Contributed(address indexed member, uint256 amount, uint256 totalBalance);
    event ProposalCreated(uint256 indexed proposalId, string title, uint256 amount);
    event ProposalSigned(uint256 indexed proposalId, address indexed signer);
    event ProposalFlagged(uint256 indexed proposalId, address indexed flagger, string reason);
    event DisputeResolved(uint256 indexed proposalId, bool approved);
    event ProposalExecuted(uint256 indexed proposalId, address recipient, uint256 amount);
    event YieldToggled(bool enabled);
    event ProposalVetoed(uint256 indexed proposalId, address indexed vetoer, uint256 vetoExpiry, string reason);
    event VetoLifted(uint256 indexed proposalId);

    modifier onlyMember() {
        require(members[msg.sender].exists, "GlobalSave: Caller is not a member");
        _;
    }

    modifier nonReentrant() {
        require(!locked, "GlobalSave: Reentrancy guard hit");
        locked = true;
        _;
        locked = false;
    }

    constructor(string memory _name, address[] memory _initialMembers, uint256 _reqSigs) {
        require(_initialMembers.length > 0, "GlobalSave: Need at least one member");
        require(_reqSigs > 0 && _reqSigs <= _initialMembers.length, "GlobalSave: Invalid signature threshold");
        groupName = _name;
        requiredSignaturesCount = _reqSigs;
        
        for(uint i = 0; i < _initialMembers.length; i++) {
            address m = _initialMembers[i];
            require(m != address(0), "GlobalSave: Invalid member address");
            require(!members[m].exists, "GlobalSave: Duplicate member address");
            members[m] = Member(m, "", 0, 100, true);
            memberList.push(m);
        }
    }

    /**
     * @notice Deposit token/native funds into the pooled cooperative vault
     */
    function contribute(uint256 _amount) external payable onlyMember {
        require(_amount > 0, "GlobalSave: Contribution must be greater than 0");
        require(msg.value == _amount, "GlobalSave: Sent value must match amount");
        members[msg.sender].totalContributed += _amount;
        totalPoolBalance += _amount;
        
        if (yieldEnabled) {
            _depositToYieldVault(_amount);
        }
        
        emit Contributed(msg.sender, _amount, totalPoolBalance);
    }

    /**
     * @notice Propose a shared expense payout or governance action to be voted or co-signed on
     */
    function createProposal(
        ProposalType _type,
        string memory _title,  
        string memory _desc, 
        uint256 _amount, 
        address payable _recipient
    ) external onlyMember returns (uint256) {
        if (_type == ProposalType.Payout) {
            require(_amount <= totalPoolBalance, "GlobalSave: Insufficient pooled funds");
        }
        
        proposalCount++;
        Proposal storage newProp = proposals[proposalCount];
        newProp.id = proposalCount;
        newProp.propType = _type;
        newProp.title = _title;
        newProp.description = _desc;
        newProp.amount = _amount;
        newProp.recipient = _recipient;
        newProp.creator = msg.sender;
        newProp.requiredSignatures = uint8(requiredSignaturesCount);
        newProp.signatureCount = 1;
        newProp.status = ProposalStatus.PendingSignatures;
        newProp.createdAt = block.timestamp;

        proposalSignatures[proposalCount][msg.sender] = true;
        
        emit ProposalCreated(proposalCount, _title, _amount);
        emit ProposalSigned(proposalCount, msg.sender);
        
        return proposalCount;
    }

    /**
     * @notice Sign/approve a pending expense request (Multi-signature logic)
     */
    function signProposal(uint256 _proposalId) external onlyMember {
        Proposal storage prop = proposals[_proposalId];
        require(prop.status == ProposalStatus.PendingSignatures, "GlobalSave: Already processed");
        require(!proposalSignatures[_proposalId][msg.sender], "GlobalSave: Already signed");
        
        proposalSignatures[_proposalId][msg.sender] = true;
        prop.signatureCount++;
        
        emit ProposalSigned(_proposalId, msg.sender);
        
        if (prop.signatureCount >= prop.requiredSignatures) {
            prop.status = ProposalStatus.Approved;
            prop.disputeDeadline = block.timestamp + 24 hours; // Start 24h safety lock window
        }
    }

    /**
     * @notice Veto Payout: Any member can temporarily pause/freeze a suspicious transaction for 24 hours.
     * This pushes execution window/dispute deadline 24 hours forward to allow thorough review.
     */
    function vetoPayout(uint256 _proposalId, string calldata _reason) external onlyMember {
        Proposal storage prop = proposals[_proposalId];
        require(
            prop.status == ProposalStatus.Approved || 
            prop.status == ProposalStatus.PendingSignatures ||
            prop.status == ProposalStatus.VetoedPaused, 
            "GlobalSave: Proposal not in an eligible state"
        );
        require(!proposalVetoers[_proposalId][msg.sender], "GlobalSave: You already vetoed this proposal");

        proposalVetoers[_proposalId][msg.sender] = true;
        prop.isVetoed = true;
        
        // Lock and add 24 hours to veto expiration/dispute deadline
        uint256 baseTime = block.timestamp > prop.vetoExpiry ? block.timestamp : prop.vetoExpiry;
        prop.vetoExpiry = baseTime + 24 hours;
        
        // Push the active disputeDeadline out as well
        if (prop.disputeDeadline < prop.vetoExpiry) {
            prop.disputeDeadline = prop.vetoExpiry;
        }

        prop.status = ProposalStatus.VetoedPaused;
        
        emit ProposalVetoed(_proposalId, msg.sender, prop.vetoExpiry, _reason);
    }

    /**
     * @notice Safety Window: Flag a transaction to permanently freeze funds for community voting
     */
    function flagProposal(uint256 _proposalId, string calldata _reason) external onlyMember {
        Proposal storage prop = proposals[_proposalId];
        require(
            prop.status == ProposalStatus.Approved || prop.status == ProposalStatus.VetoedPaused, 
            "GlobalSave: Not eligible for dispute"
        );
        if (prop.status == ProposalStatus.Approved) {
            require(block.timestamp <= prop.disputeDeadline, "GlobalSave: Dispute window has closed");
        }
        
        prop.status = ProposalStatus.FlaggedLocked;
        prop.flagger = msg.sender;
        prop.disputeDeadline = block.timestamp + 24 hours; // Reset voting duration
        
        emit ProposalFlagged(_proposalId, msg.sender, _reason);
    }

    /**
     * @notice Vote in dispute governance
     */
    function voteDispute(uint256 _proposalId, bool _support) external onlyMember {
        Proposal storage prop = proposals[_proposalId];
        require(prop.status == ProposalStatus.FlaggedLocked, "GlobalSave: Dispute is not active");
        require(block.timestamp <= prop.disputeDeadline, "GlobalSave: Voting has ended");
        require(!disputeVotes[_proposalId][msg.sender], "GlobalSave: Already voted");
        
        disputeVotes[_proposalId][msg.sender] = true;
        if (_support) {
            prop.votesApprove += 1;
        } else {
            prop.votesReject += 1;
        }
    }

    /**
     * @notice Resolve dispute after deadline has passed
     */
    function resolveDispute(uint256 _proposalId) external {
        Proposal storage prop = proposals[_proposalId];
        require(prop.status == ProposalStatus.FlaggedLocked, "GlobalSave: Not flagged");
        require(block.timestamp > prop.disputeDeadline, "GlobalSave: Voting ongoing");
        
        bool approved = prop.votesApprove >= prop.votesReject;
        if (approved) {
            prop.status = ProposalStatus.Approved;
            prop.isVetoed = false; // Veto lifted by successful vote
        } else {
            prop.status = ProposalStatus.Rejected;
            members[prop.creator].reputationScore = members[prop.creator].reputationScore > 10 ? members[prop.creator].reputationScore - 10 : 0;
        }
        
        emit DisputeResolved(_proposalId, approved);
    }

    /**
     * @notice Execute an approved expense payout or governance action (requires multi-sig threshold + lock window cleared)
     */
    function executeProposal(uint256 _proposalId) external onlyMember nonReentrant {
        Proposal storage prop = proposals[_proposalId];
        require(prop.status == ProposalStatus.Approved, "GlobalSave: Proposal not approved");
        require(block.timestamp > prop.disputeDeadline, "GlobalSave: 24h safety/veto window is still active");
        require(!prop.isVetoed || block.timestamp > prop.vetoExpiry, "GlobalSave: Transaction is frozen by a 24h Veto");
        
        prop.status = ProposalStatus.Executed;
        
        if (prop.propType == ProposalType.Payout) {
            require(prop.amount <= totalPoolBalance, "GlobalSave: Insufficient pooled funds");
            if (yieldEnabled) {
                _withdrawFromYieldVault(prop.amount);
            }
            totalPoolBalance -= prop.amount;
            
            // Secure native transfer replacing vulnerable .transfer() stipend limits
            (bool success, ) = prop.recipient.call{value: prop.amount}("");
            require(success, "GlobalSave: Payout native transfer failed");
            
        } else if (prop.propType == ProposalType.AddMember) {
            require(prop.recipient != address(0), "GlobalSave: Invalid target address");
            require(!members[prop.recipient].exists, "GlobalSave: Address is already a member");
            members[prop.recipient] = Member(prop.recipient, "", 0, 100, true);
            memberList.push(prop.recipient);
            
        } else if (prop.propType == ProposalType.RemoveMember) {
            require(members[prop.recipient].exists, "GlobalSave: Target is not a member");
            require(memberList.length > 1, "GlobalSave: Cannot remove the last member");
            
            members[prop.recipient].exists = false;
            
            // Remove target member from active member list array
            for (uint i = 0; i < memberList.length; i++) {
                if (memberList[i] == prop.recipient) {
                    memberList[i] = memberList[memberList.length - 1];
                    memberList.pop();
                    break;
                }
            }
            
            // Auto-adjust consensus signatures threshold if it exceeds new pool size
            if (requiredSignaturesCount > memberList.length) {
                requiredSignaturesCount = memberList.length;
            }
            
        } else if (prop.propType == ProposalType.ToggleYield) {
            bool enableYield = prop.amount > 0;
            yieldEnabled = enableYield;
            emit YieldToggled(enableYield);
        }
        
        emit ProposalExecuted(_proposalId, prop.recipient, prop.amount);
    }
    
    function _depositToYieldVault(uint256 _amount) internal {
        // DeFi wrapper call on high performance Monad Testnet
    }
    
    function _withdrawFromYieldVault(uint256 _amount) internal {
        // DeFi wrapper call on high performance Monad Testnet
    }
}
