import { SecurityAgent } from '../core/SecurityAgent.js';

async function runTest() {
    console.log("--- Starting Local LLM Audit Test ---");
    const sampleContract = `
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.0;

    contract Vulnerable {
        mapping(address => uint256) public balances;

        function deposit() public payable {
            balances[msg.sender] += msg.value;
        }

        function withdraw() public {
            uint256 amount = balances[msg.sender];
            (bool success, ) = msg.sender.call{value: amount}("");
            require(success, "Transfer failed");
            balances[msg.sender] = 0;
        }
    }
    `;

    try {
        const report = await SecurityAgent.run(sampleContract, (msg) => {
            console.log(`[Progress]: ${msg}`);
        });

        console.log("\n--- Audit Report ---");
        console.log(JSON.stringify(report, null, 2));
    } catch (error) {
        console.error("Test failed:", error);
    }
}

runTest();
