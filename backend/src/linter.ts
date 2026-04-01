import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** 
 * Solidity Linter Wrapper 
 * uses solhint to check for security and style issues
 */
export async function auditCodeStyle(code: string): Promise<any[]> {
    console.log("🛡️ Solidity Linter: Analyzing code quality...");
    
    const tmpFile = path.join(__dirname, `tmp_${Date.now()}.sol`);
    const configPath = path.join(__dirname, '../../.solhint.json');
    
    // Create default config if not exists
    if (!fs.existsSync(configPath)) {
        const defaultConfig = {
            "extends": "solhint:recommended",
            "rules": {
                "compiler-version": ["error", "^0.8.0"],
                "func-visibility": ["warn", { "ignoreConstructors": true }],
                "no-empty-blocks": "warn",
                "no-unused-vars": "error"
            }
        };
        fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
    }

    try {
        fs.writeFileSync(tmpFile, code);
        
        // Run solhint CLI
        // Use npx to ensure it finds the local installation
        const cmd = `npx solhint "${tmpFile}" --config "${configPath}" -f json`;
        let output = "";
        
        try {
            output = execSync(cmd).toString();
        } catch (err: any) {
            // solhint returns non-zero exit code if issues are found
            output = err.stdout?.toString() || "[]";
        }

        // Parse result
        const results = JSON.parse(output);
        const findings = results[0]?.reports || [];

        return findings.map((f: any) => ({
            line: f.line,
            column: f.column,
            severity: f.severity === 2 ? 'High' : 'Medium',
            issue: f.message,
            rule: f.ruleId
        }));

    } catch (error: any) {
        console.error("Linter crashed:", error);
        return [{ issue: "Linter failed to run", severity: "Low", detail: error.message }];
    } finally {
        if (fs.existsSync(tmpFile)) {
            fs.unlinkSync(tmpFile);
        }
    }
}
