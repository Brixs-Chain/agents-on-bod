'use client';

import React, { useState } from 'react';
import './index.css';

interface Vulnerability {
  severity: 'High' | 'Medium' | 'Low';
  type: string;
  description: string;
  line: number;
  remediation: string;
}

interface AuditReport {
  contractName: string;
  vulnerabilities: Vulnerability[];
  securityScore: number;
}

export default function Dashboard() {
  const [code, setCode] = useState('');
  const [report, setReport] = useState<AuditReport | null>(null);
  const [fixedCode, setFixedCode] = useState<string | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  const startAudit = async () => {
    setIsAuditing(true);
    // Simulate API call to the Auditor backend
    // In production, this would be: 
    // fetch('/api/audit', { method: 'POST', body: JSON.stringify({ code }) })
    
    setTimeout(() => {
      setReport({
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
      });
      setIsAuditing(false);
    }, 2000);
  };

  const applyFix = () => {
    setFixedCode(`
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BrixsFixedContract is ReentrancyGuard, Ownable {
    mapping(address => uint256) public balances;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    /// @notice Reentrancy fixed using CEI and ReentrancyGuard
    function withdraw(uint256 amount) public nonReentrant {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        // Effects
        balances[msg.sender] -= amount;

        // Interactions
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
    }

    /// @notice Access Control fixed with onlyOwner
    function setAdmin(address _newAdmin) public onlyOwner {
        // ... Admin logic here ...
    }
}
    `.trim());
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
          <span className="glass-card" style={{ padding: '8px 16px', fontSize: '0.9rem' }}> Credits: <span style={{ color: 'var(--accent-secondary)' }}>$45.00</span></span>
          <button className="btn-primary">Connect Wallet</button>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="sidebar">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-card" style={{ padding: '12px' }}>📊 Dashboard</div>
          <div className="glass-card" style={{ padding: '12px' }}>🛡️ Security Audits</div>
          <div className="glass-card" style={{ padding: '12px' }}>⚙️ Deployment Info</div>
          <div className="glass-card" style={{ padding: '12px' }}>📜 Documentation</div>
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
            <h2 style={{ fontSize: '2.5rem', background: 'var(--danger)', WebkitBackgroundClip: 'text' }}>{report ? report.vulnerabilities.filter(v => v.severity === 'High').length : '--'}</h2>
          </div>
          <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-secondary)' }}>
            <span className="text-muted">AI Efficiency</span>
            <h2 style={{ fontSize: '2.5rem' }}>98.2%</h2>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '32px' }}>
          {/* Code Input / Preview */}
          <div className="glass-card" style={{ minHeight: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3>Contract Compiler</h3>
              <button 
                className="btn-primary" 
                onClick={startAudit}
                disabled={isAuditing}
              >
                {isAuditing ? 'Auditing...' : '🚀 Start AI Audit'}
              </button>
            </div>
            
            {fixedCode ? (
              <pre className="code-preview" style={{ borderLeftColor: 'var(--success)' }}>
                {fixedCode}
              </pre>
            ) : (
              <textarea 
                className="code-preview" 
                style={{ width: '100%', minHeight: '400px', border: 'none', resize: 'none', background: '#111' }}
                placeholder="Paste your Solidity smart contract here..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            )}
          </div>

          {/* Audit Results */}
          <div className="glass-card">
            <h3>Audit Findings</h3>
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {!report && !isAuditing && <p className="text-muted">No audit performed yet. Submit a contract to begin detection.</p>}
              {isAuditing && <div className="text-muted" style={{ padding: '20px', textAlign: 'center' }}>AI is analyzing bytecode patterns...</div>}
              {report && report.vulnerabilities.map((v, i) => (
                <div key={i} className="glass-card" style={{ padding: '16px', background: '#16161c' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span className={`severity-badge ${v.severity.toLowerCase()}`}>{v.severity}</span>
                    <span className="text-muted">Line {v.line}</span>
                  </div>
                  <strong style={{ display: 'block', marginBottom: '4px' }}>{v.type}</strong>
                  <p className="text-muted" style={{ fontSize: '0.9rem', margin: 0 }}>{v.description}</p>
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
                {fixedCode ? '✨ Security Patch Applied' : '🛡️ Apply AI-Verified Fixes'}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
