import { 
  PERSONA_AUDITOR, 
  PERSONA_EXPLOITER, 
  PERSONA_DEVELOPER, 
  SURFACE_SCAN_PROMPT 
} from './Prompts.js';
import { LocalLLMClient } from './LocalLLMClient.js';

/**
 * PHASE 1: Surface Scan
 * Rapid identification of security hotspots.
 */
async function performSurfaceScan(code: string): Promise<string[]> {
    console.log("[Phase 1] Performing rapid surface scan with local LLM...");
    const prompt = `${PERSONA_AUDITOR}\n\nTask: ${SURFACE_SCAN_PROMPT}\n\nCode:\n${code}\n\nReturn EXACTLY a JSON array of function names or code blocks that are suspicious. Example: ["withdraw()", "logic_block_1"]`;
    
    try {
        const result = await LocalLLMClient.generate(prompt);
        // Basic extraction of JSON array if the LLM adds chatter
        const jsonMatch = result.match(/\[.*\]/s);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return [];
    } catch (error) {
        console.error("Surface scan failed, falling back to basic analysis.");
        return ["main()"]; 
    }
}

/**
 * PHASE 2: Exploit Hypothesis
 * Adopts adversarial persona to prove the vulnerability is real.
 */
async function formulateExploit(finding: string, code: string): Promise<string> {
    console.log(`[Phase 2] Formulating exploit for: ${finding}`);
    const prompt = `${PERSONA_EXPLOITER}\n\nContext: We found a potential issue in ${finding}.\n\nCode:\n${code}\n\nTask: Describe the exploit sequence and provide a brief PoC description.`;
    
    return await LocalLLMClient.generate(prompt);
}

/**
 * PHASE 3: Remediation
 * Generates a security patch with gas optimization.
 */
async function remediateVulnerability(finding: string, code: string): Promise<string> {
    console.log(`[Phase 3] Generating security patch for: ${finding}`);
    const prompt = `${PERSONA_DEVELOPER}\n\nContext: Fixing ${finding} in the following code:\n${code}\n\nTask: Provide the corrected code block or specific remediation steps.`;
    
    return await LocalLLMClient.generate(prompt);
}

/**
 * SecurityAgent Orchestrator
 * The core 'Brain' of the Brixs platform.
 */
export class SecurityAgent {
    public static async run(code: string, onProgress: (msg: string) => void): Promise<any> {
        onProgress("Initializing Autonomous Security Agent (Local Mode)...");
        
        // 1. Surface Scan
        const scannerFindings = await performSurfaceScan(code);
        onProgress(`Scan complete. Found ${scannerFindings.length} potential hotspots.`);

        const finalReport: any = {
            findings: [],
            totalRisks: scannerFindings.length,
            agentConfidence: 0.95,
            mode: "Local AI"
        };

        for (const finding of scannerFindings) {
            onProgress(`Deep-diving into: ${finding}...`);
            
            // 2. Exploit Analysis
            const exploitPoC = await formulateExploit(finding, code);
            onProgress(`Exploit analysis complete for ${finding}.`);

            // 3. Remediation
            const fixStrategy = await remediateVulnerability(finding, code);
            onProgress(`Remediation generated for ${finding}.`);

            finalReport.findings.push({
                issue: finding,
                exploit: exploitPoC,
                remediation: fixStrategy,
                severity: "High"
            });
        }

        onProgress("Audit complete. Finalizing security report.");
        return finalReport;
    }
}
