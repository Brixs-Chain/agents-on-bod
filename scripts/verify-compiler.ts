// Native fetch is available in Node 22+

const code = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Test {
    uint public x;
    
    function set(uint _x) public {
        x = _x;
    }
    
    function get() public view returns (uint) {
        return x;
    }
    
    // Warning: empty block
    function empty() public {}
}
`;

async function test() {
    console.log("🚀 Testing Brixs Compiler API...");
    try {
        const res = await fetch('http://localhost:3001/api/compile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, name: "TestContract" })
        });
        
        const data = await res.json();
        console.log("Response Success:", data.success);
        console.log("Linter Findings:", data.linting.length);
        
        if (data.compilation.errors) {
            console.log("Compiler Errors:", data.compilation.errors.length);
        }
        
        if (data.success) {
            console.log("✅ Compiler Integration Verified!");
        } else {
            console.log("❌ Compiler Integration Failed.");
            console.log(JSON.stringify(data, null, 2));
        }
    } catch (err) {
        console.error("Test failed:", err);
    }
}

test();
