// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/GlobalSave.sol";

contract GlobalSaveTest is Test {
    GlobalSave public globalSave;
    address[] public initialMembers;
    
    address public member1 = address(0x1);
    address public member2 = address(0x2);
    address public member3 = address(0x3);

    function setUp() public {
        initialMembers.push(member1);
        initialMembers.push(member2);
        initialMembers.push(member3);
        
        // 2 required signatures out of 3 members
        globalSave = new GlobalSave("NomadNest Vault", initialMembers, 2);
    }

    function test_Contribution() public {
        vm.startPrank(member1);
        vm.deal(member1, 10 ether);
        
        globalSave.contribute{value: 1 ether}(1 ether);
        
        assertEq(globalSave.totalPoolBalance(), 1 ether);
        (, , uint256 contributed, , ) = globalSave.members(member1);
        assertEq(contributed, 1 ether);
        vm.stopPrank();
    }
}
