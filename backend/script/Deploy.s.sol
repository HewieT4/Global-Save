// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/GlobalSave.sol";

contract DeployGlobalSave is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        address[] memory initialMembers = new address[](3);
        initialMembers[0] = 0x3ea789f1d9405c10faee58de5c01bcde8b328b1E;
        initialMembers[1] = 0x9d2a45a1c1d9405c10faee58de5c01bcde8b321a3F;
        initialMembers[2] = 0x7c4f12e1d9405c10faee58de5c01bcde8b32d892;

        // Deploy vault with 2-of-3 signatures threshold
        new GlobalSave("NomadNest Vault", initialMembers, 2);

        vm.stopBroadcast();
    }
}
