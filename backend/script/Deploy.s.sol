// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/GlobalSave.sol";
import "../src/GlobalSaveFactory.sol";

contract DeployGlobalSave is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        vm.startBroadcast(deployerPrivateKey);

        GlobalSaveFactory factory = new GlobalSaveFactory();
        console.log("GlobalSaveFactory deployed at:", address(factory));

        address[] memory initialMembers = new address[](1);
        initialMembers[0] = deployer;

        address vault = factory.createVault("NomadNest Lisbon Co-Living", initialMembers, 1);
        console.log("First vault deployed at:", vault);

        vm.stopBroadcast();
    }
}
