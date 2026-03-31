# Brixs: AI-Powered Smart Contract Security Platform

Brixs is an industrial-grade ecosystem for generating, auditing, and autonomously remediating smart contracts. It combines the reasoning power of Claude 3.5 with a verifying compiler loop to ensure maximum security for DeFi protocols and on-chain assets.

## 🚀 Key Features

- **Autonomous Security Agent**: A stateful reasoning engine that performs surface scans, adversarial exploit hypotheses, and verifiable remediation.
- **Verifying Compiler Loop**: Every AI-generated patch is automatically compiled and verified for safety before being presented.
- **Executive Dashboard**: A premium, glassmorphism-inspired UI for real-time risk visualization and one-click patching.
- **Agent Onboarding**: Automated system readiness and dataset initialization.

## 📁 Repository Structure

- `core/`: The Autonomous Security Agent logic and prompts.
- `backend/`: Express.js API server for audit orchestration.
- `dashboard/`: Next.js web interface.
- `scripts/`: Operational scripts for onboarding and deployment.

## 🛠️ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Onboard the Agent
```bash
npm run onboard
```

### 3. Start Development
```bash
# Start Backend
npm run dev:backend

# Start Dashboard
npm run dev:dashboard
```

## 🛡️ Security Agent Logic
The agent operates in four distinct phases:
1. **Surface Scan**: Identifies suspicious code patterns.
2. **Exploit Hypothesis**: Adversarial reasoning to prove vulnerabilities.
3. **Remediation**: Generates gas-optimized security patches.
4. **Verification**: Compiler check for fix validity.

## 📄 License
MIT © Brixs Chain 2024
