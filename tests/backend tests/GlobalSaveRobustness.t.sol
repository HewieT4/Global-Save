// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../../backend/src/GlobalSave.sol";

// Malicious contract trying to perform a reentrancy attack on executeProposal
contract ReentrancyAttacker {
    GlobalSave public target;
    uint256 public proposalId;
    uint256 public attackCount;

    constructor(GlobalSave _target) {
        target = _target;
    }

    function setProposal(uint256 _proposalId) external {
        proposalId = _proposalId;
    }

    // fallback triggers reentrancy
    receive() external payable {
        if (attackCount < 2) {
            attackCount++;
            // Try to re-enter executeProposal
            target.executeProposal(proposalId);
        }
    }
}

contract GlobalSaveRobustnessTest is Test {
    GlobalSave public globalSave;
    address[] public initialMembers;
    
    address public member1 = address(0x1);
    address public member2 = address(0x2);
    address public member3 = address(0x3);
    address public nonMember = address(0x999);

    function setUp() public {
        initialMembers.push(member1);
        initialMembers.push(member2);
        initialMembers.push(member3);
        
        // Deploy a vault with 2 required signatures out of 3 members
        globalSave = new GlobalSave("NomadNest Lisbon", initialMembers, 2);
    }

    // 1. Constructor edge cases (revert on duplicates and zero addresses)
    function test_ConstructorRevertOnDuplicate() public {
        address[] memory dups = new address[](3);
        dups[0] = member1;
        dups[1] = member2;
        dups[2] = member1; // duplicate

        vm.expectRevert("GlobalSave: Duplicate member address");
        new GlobalSave("Dup Group", dups, 2);
    }

    function test_ConstructorRevertOnZeroAddress() public {
        address[] memory zeros = new address[](2);
        zeros[0] = member1;
        zeros[1] = address(0); // zero address

        vm.expectRevert("GlobalSave: Invalid member address");
        new GlobalSave("Zero Group", zeros, 1);
    }

    // 2. Access control and unauthorized calling restrictions
    function test_ContributeRevertsForNonMember() public {
        vm.startPrank(nonMember);
        vm.deal(nonMember, 5 ether);
        vm.expectRevert("GlobalSave: Caller is not a member");
        globalSave.contribute{value: 1 ether}(1 ether);
        vm.stopPrank();
    }

    function test_CreateProposalRevertsForNonMember() public {
        vm.startPrank(nonMember);
        vm.expectRevert("GlobalSave: Caller is not a member");
        globalSave.createProposal(
            GlobalSave.ProposalType.Payout,
            "Hack",
            "Steal funds",
            1 ether,
            payable(nonMember)
        );
        vm.stopPrank();
    }

    // 3. Consensus safety lock validation
    function test_ExecuteProposalRevertsIfNotApproved() public {
        vm.startPrank(member1);
        vm.deal(member1, 5 ether);
        globalSave.contribute{value: 2 ether}(2 ether);

        // Create payout proposal
        uint256 propId = globalSave.createProposal(
            GlobalSave.ProposalType.Payout,
            "Rent Payment",
            "Pay landlord",
            1 ether,
            payable(member3)
        );
        
        // Attempt execution immediately without second signature
        vm.expectRevert("GlobalSave: Proposal not approved");
        globalSave.executeProposal(propId);
        vm.stopPrank();
    }

    // 4. Time locks and veto periods
    function test_ExecuteProposalRevertsBeforeSafetyWindow() public {
        vm.startPrank(member1);
        vm.deal(member1, 5 ether);
        globalSave.contribute{value: 2 ether}(2 ether);

        uint256 propId = globalSave.createProposal(
            GlobalSave.ProposalType.Payout,
            "Rent Payment",
            "Pay landlord",
            1 ether,
            payable(member3)
        );
        vm.stopPrank();

        // Sign as member2 to approve the proposal
        vm.startPrank(member2);
        globalSave.signProposal(propId);

        // Status is approved, but the 24h dispute safety window is active
        vm.expectRevert("GlobalSave: 24h safety/veto window is still active");
        globalSave.executeProposal(propId);
        vm.stopPrank();
    }

    // 5. Reentrancy Guard Verification
    function test_ReentrancyGuardBlocksAttacker() public {
        vm.startPrank(member1);
        vm.deal(member1, 10 ether);
        globalSave.contribute{value: 5 ether}(5 ether);

        // Deploy malicious attacker contract as payout recipient
        ReentrancyAttacker attacker = new ReentrancyAttacker(globalSave);

        // Create proposal to transfer native to attacker
        uint256 propId = globalSave.createProposal(
            GlobalSave.ProposalType.Payout,
            "Malicious Payout",
            "Try to reenter",
            1 ether,
            payable(address(attacker))
        );
        attacker.setProposal(propId);
        vm.stopPrank();

        // Sign and approve as member2
        vm.startPrank(member2);
        globalSave.signProposal(propId);
        vm.stopPrank();

        // Move block time forward 24h + 1s to pass safety dispute windows
        vm.warp(block.timestamp + 24 hours + 1);

        // Execute payout and expect revert due to reentrancy lock
        vm.startPrank(member1);
        vm.expectRevert("GlobalSave: Reentrancy guard hit");
        globalSave.executeProposal(propId);
        vm.stopPrank();
    }

    // 6. Governance Payout & Membership proposals
    function test_AddMemberProposalLifecycle() public {
        vm.startPrank(member1);
        address newMember = address(0x777);

        // Propose adding new member
        uint256 propId = globalSave.createProposal(
            GlobalSave.ProposalType.AddMember,
            "Add Bob",
            "Register new co-signer",
            0,
            payable(newMember)
        );
        vm.stopPrank();

        // Approve as member2
        vm.startPrank(member2);
        globalSave.signProposal(propId);
        vm.stopPrank();

        // Warp time beyond 24h lock
        vm.warp(block.timestamp + 24 hours + 1);

        // Execute proposal
        vm.startPrank(member1);
        globalSave.executeProposal(propId);
        
        // Assert member was added
        (address wallet, , , , bool exists) = globalSave.members(newMember);
        assertTrue(exists);
        assertEq(wallet, newMember);
        vm.stopPrank();
    }
}
