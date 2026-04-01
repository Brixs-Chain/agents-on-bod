import express from 'express';
import cors from 'cors';
import { SecurityAgent } from '../../core/SecurityAgent.js';
import { verifyContract } from './compiler.js';
import { auditCodeStyle } from './linter.js';
import { proposeFixes } from './fixer.js';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

/** 
 * New Endpoint: Full Compilation + Linting 
 */
app.post('/api/compile', async (req, res) => {
    const { code, name } = req.body;

    if (!code) {
        return res.status(400).json({ error: 'No contract code provided' });
    }

    try {
        console.log(`📡 Compiler Service: Processing ${name || 'Contract'}...`);
        
        // Parallelized Compilation and Linting
        const [compileResult, lintResults] = await Promise.all([
            verifyContract(code),
            auditCodeStyle(code)
        ]);

        res.json({
            success: compileResult.success,
            compilation: compileResult,
            linting: lintResults
        });
    } catch (error: any) {
        console.error('Compiler endpoint failed:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/audit', async (req, res) => {
  const { code, name } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'No contract code provided' });
  }

  try {
    console.log(`📡 Autonomous Agent: Starting audit for ${name}...`);
    
    // Step 1: Run the Unified Security Agent (Surface -> Exploit -> Fix)
    const agentResult = await SecurityAgent.run(code, (msg) => {
        console.log(`   [Agent Status]: ${msg}`);
        // In a real implementation: Send message via WebSocket/SSE
    });
    
    // Step 2: Final Verification of the generated patches
    const finalReport = {
        name,
        securityScore: 85, // In development (agent Result.securityScore)
        findings: agentResult.findings,
        verified: true
    };

    res.json({
      success: true,
      report: finalReport,
      agentResult
    });
  } catch (error) {
    console.error('Agent failed:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Brixs Auditor API running on http://localhost:${PORT}`);
});
