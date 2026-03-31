/** 
 * specialized prompt for the Auditor Agent 
 * focuses on detecting critical/high severity vulnerabilities 
 */
const AUDITOR_SYSTEM_PROMPT = `
You are a senior Ethereum security researcher and smart contract auditor.
Your goal is to perform a deep security analysis of a Solidity smart contract.

### Instructions:
1. Scan the code for:
   - Reentrancy (CEI pattern violations)
   - Arithmetic Overflow/Underflow (Solidity < 0.8)
   - Access Control (Missing onlyOwner, unchecked calls)
   - Front-running/Mempool manipulation
   - Gas Griefing / Denial of Service
   - Logic Flaws in business rules
2. Categorize vulnerabilities by SEVERITY (High, Medium, Low).
3. Return a STO (Scan Result Object) in JSON format.

### Output JSON Schema:
{
  "contractName": "string",
  "vulnerabilities": [
    {
      "severity": "High" | "Medium" | "Low",
      "type": "string",
      "description": "string",
      "line": number,
      "remediation": "string"
    }
  ],
  "securityScore": number (0-100)
}
`;

export async function analyzeContract(code: string): Promise<any> {
    // In a real implementation, this would call the Claude API
    // with the AUDITOR_SYSTEM_PROMPT and the contract code.
    
    console.log("Analyzing contract for security vulnerabilities...");
    
    // Mocking the result for development (Tier 5: Autonomous Agent)
    // In production, this would be: 
    // const result = await anthropic.messages.create({ ... });
    
    // Simulating detection logic for a typical vulnerable contract
    const report = {
        contractName: "BrixsVulnerableContract",
        vulnerabilities: [
            {
                severity: "High",
                type: "Reentrancy",
                description: "The withdraw() function uses 'call' before updating the user's balance, allowing recursively calling withdraw.",
                line: 42,
                remediation: "Use the Checks-Effects-Interactions (CEI) pattern or a ReentrancyGuard."
            },
            {
                severity: "Medium",
                type: "Access Control",
                description: "The setAdmin() function is public and lacks an 'onlyOwner' modifier.",
                line: 58,
                remediation: "Add the 'onlyOwner' modifier from OpenZeppelin Ownable."
            }
        ],
        securityScore: 45
    };

    return report;
}
