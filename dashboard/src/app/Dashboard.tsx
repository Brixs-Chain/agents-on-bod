'use client';

import React, { useState } from 'react';
import './index.css';

interface Finding {
  issue: string;
  exploit: string;
  remediation: string;
  severity: 'High' | 'Medium' | 'Low';
}

interface AuditReport {
  name: string;
  securityScore: number;
  findings: Finding[];
}

export default function Dashboard() {
  const [code, setCode] = useState('');
  const [report, setReport] = useState<AuditReport | null>(null);
  const [fixedCode, setFixedCode] = useState<string | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileData, setCompileData] = useState<any>(null);

  const startCompile = async () => {
    if (!code) return alert("Please paste some Solidity code first.");
    
    setIsCompiling(true);
    setCompileData(null);

    try {
      const response = await fetch('http://localhost:3001/api/compile', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, name: "BrixsContract" }) 
      });

      const data = await response.json();
      setCompileData(data);
      
      if (!data.success) {
        console.error("Compilation failed", data.compilation.errors);
      }
    } catch (error) {
      console.error("Connection error:", error);
      alert("Could not connect to the Compiler API.");
    } finally {
      setIsCompiling(false);
    }
  };

  const startAudit = async () => {
    if (!code) return alert("Please paste some Solidity code first.");
    
    setIsAuditing(true);
    setReport(null);
    setFixedCode(null);

    try {
      // Calling the real Brixs Auditor API
      const response = await fetch('http://localhost:3001/api/audit', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, name: "BrixsSmartContract" }) 
      });

      const data = await response.json();
      
      if (data.success) {
        setReport({
          name: data.report.name,
          securityScore: data.report.securityScore,
          findings: data.report.findings
        });
      } else {
        alert("Audit failed: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Connection error:", error);
      alert("Could not connect to the Brixs AI Backend. Make sure it is running on port 3001.");
    } finally {
      setIsAuditing(false);
    }
  };

  const applyFix = () => {
    if (!report || report.findings.length === 0) return;
    
    // Simplification: In a real app, the agent would return the full patched code.
    // Here we combine the remediation steps into a preview.
    const fullPatch = report.findings.map(f => `// FIX FOR: ${f.issue}\n${f.remediation}`).join('\n\n');
    setFixedCode(fullPatch);
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', background: 'var(--accent-primary)', borderRadius: '8px' }}></div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>BRIXS <span style={{ fontWeight: 300 }}>PLATFORM</span></h2>
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <span className="glass-card" style={{ padding: '8px 16px', fontSize: '0.9rem' }}> AI Status: <span style={{ color: 'var(--accent-secondary)' }}>ONLINE (Unlimited)</span></span>
          <button className="btn-primary">Connect Wallet</button>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="sidebar">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-card" style={{ padding: '12px', cursor: 'pointer' }}>📊 Dashboard</div>
          <div className="glass-card" style={{ padding: '12px', cursor: 'pointer', borderLeft: '2px solid var(--accent-primary)' }}>🛡️ Security Audits</div>
          <div className="glass-card" style={{ padding: '12px', cursor: 'pointer' }}>⚙️ AI Settings</div>
          <div className="glass-card" style={{ padding: '12px', cursor: 'pointer' }}>📜 Documentation</div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <h1 style={{ marginBottom: '32px' }}>BRIXS AI <span style={{ color: 'var(--text-main)', opacity: 0.5 }}>- AUTONOMOUS AGENT</span></h1>

        <div className="stats-grid">
          <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-primary)' }}>
            <span className="text-muted">Security Score</span>
            <h2 style={{ fontSize: '2.5rem' }}>{report ? report.securityScore : '--'}</h2>
          </div>
          <div className="glass-card" style={{ borderLeft: '4px solid var(--danger)' }}>
            <span className="text-muted">High Risks</span>
            <h2 style={{ fontSize: '2.5rem', background: 'var(--danger)', WebkitBackgroundClip: 'text' }}>{report ? report.findings.filter(v => v.severity === 'High').length : '--'}</h2>
          </div>
          <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-secondary)' }}>
            <span className="text-muted">Agent Usage</span>
            <h2 style={{ fontSize: '2.5rem' }}>Unlimited</h2>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '32px' }}>
          {/* Code Input / Preview */}
          <div className="glass-card" style={{ minHeight: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', gap: '10px' }}>
              <h3>Smart Contract Input</h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  className="btn-primary" 
                  style={{ background: 'var(--accent-secondary)' }}
                  onClick={startCompile}
                  disabled={isCompiling}
                >
                  {isCompiling ? 'Compiling...' : '⚡ Compile & Lint'}
                </button>
                <button 
                  className="btn-primary" 
                  onClick={startAudit}
                  disabled={isAuditing}
                >
                  {isAuditing ? 'AI Reasoning...' : '🚀 Start AI Audit'}
                </button>
              </div>
            </div>
            
            {fixedCode ? (
              <div style={{ position: 'relative' }}>
                <pre className="code-preview" style={{ borderLeftColor: 'var(--success)', whiteSpace: 'pre-wrap' }}>
                  {fixedCode}
                </pre>
                <button 
                  onClick={() => setFixedCode(null)}
                  style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Edit Original
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <textarea 
                  className="code-preview" 
                  style={{ width: '100%', minHeight: '300px', border: 'none', resize: 'none', background: '#111', color: '#0f0', fontFamily: 'monospace' }}
                  placeholder="Paste your Solidity smart contract here..."
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                
                {/* Compiler & Linter Diagnostics */}
                {compileData && (
                  <div className="glass-card" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid #333' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h4 style={{ margin: 0 }}>📊 Real-time Diagnostics</h4>
                      <span className={`severity-badge ${compileData.success ? 'low' : 'high'}`}>
                        {compileData.success ? 'Build Success' : 'Build Failed'}
                      </span>
                    </div>
                    
                    <div style={{ fontSize: '0.85rem', maxHeight: '150px', overflowY: 'auto' }}>
                      {/* Compiler Errors/Warnings */}
                      {compileData.compilation.errors && compileData.compilation.errors.map((e: any, i: number) => (
                        <div key={i} style={{ color: e.severity === 'error' ? 'var(--danger)' : 'var(--warning)', padding: '4px 0', borderBottom: '1px solid #222' }}>
                          [{e.severity.toUpperCase()}] Line {e.line}: {e.message}
                        </div>
                      ))}
                      
                      {/* Linter Findings */}
                      {compileData.linting && compileData.linting.map((l: any, i: number) => (
                        <div key={`lint-${i}`} style={{ color: 'var(--accent-secondary)', padding: '4px 0', borderBottom: '1px solid #222' }}>
                          [LINT] Line {l.line}: {l.issue} ({l.rule})
                        </div>
                      ))}
                      
                      {compileData.success && !compileData.compilation.warnings.length && !compileData.linting.length && (
                        <div style={{ color: 'var(--success)' }}>✨ No issues found. Contract is clean and compiles successfully.</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Audit Results */}
          <div className="glass-card">
            <h3>Autonomous Audit Findings</h3>
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '400px', overflowY: 'auto' }}>
              {!report && !isAuditing && <p className="text-muted">No audit performed yet. Submit a contract to begin real-time local AI detection.</p>}
              {isAuditing && <div className="text-muted" style={{ padding: '20px', textAlign: 'center' }}>Agent is conducting surface scans & exploit simulations...</div>}
              {report && report.findings.map((v, i) => (
                <div key={i} className="glass-card" style={{ padding: '16px', background: '#16161c' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span className={`severity-badge ${v.severity.toLowerCase()}`}>{v.severity}</span>
                  </div>
                  <strong style={{ display: 'block', marginBottom: '4px' }}>Issue: {v.issue}</strong>
                  <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '8px' }}>{v.exploit}</p>
                  <div style={{ padding: '8px', background: '#000', borderRadius: '4px', fontSize: '0.8rem', color: 'var(--success)' }}>
                    <strong>Patch Strategy:</strong> {v.remediation.substring(0, 100)}...
                  </div>
                </div>
              ))}
            </div>
            {report && (
              <button 
                className="btn-primary" 
                style={{ width: '100%', marginTop: '24px', background: 'var(--success)', color: '#000' }}
                onClick={applyFix}
                disabled={!!fixedCode}
              >
                {fixedCode ? '✨ Patch Displayed' : '🛡️ View AI-Verified Fixes'}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
