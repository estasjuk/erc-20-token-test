// contracts/TestErcToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestErcToken is ERC20 {
    // Define the supply of TestErcToken: 1,000,000
    uint256 constant initialSupply = 7 * (10 ** 18);

    // Constructor will be called on contract creation
    constructor() ERC20("TestErcToken", "TSTERC") {
        _mint(msg.sender, initialSupply);
    }
}
