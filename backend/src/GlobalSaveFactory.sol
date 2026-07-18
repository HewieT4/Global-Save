// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./GlobalSave.sol";

contract GlobalSaveFactory {
    address[] public deployedVaults;

    event VaultCreated(address indexed vaultAddress, string name, address[] initialMembers, uint256 reqSigs, address creator);

    function createVault(
        string memory _name, 
        address[] memory _initialMembers, 
        uint256 _reqSigs
    ) external returns (address) {
        // Deploy a new GlobalSave vault contract instance
        GlobalSave newVault = new GlobalSave(_name, _initialMembers, _reqSigs);
        
        address vaultAddr = address(newVault);
        deployedVaults.push(vaultAddr);
        
        emit VaultCreated(vaultAddr, _name, _initialMembers, _reqSigs, msg.sender);
        
        return vaultAddr;
    }

    function getDeployedVaults() external view returns (address[] memory) {
        return deployedVaults;
    }
}
