Smart Contract Vulnerability Detection & Code Patching

Product Requirements Document (PRD)

Project Type: Hackathon MVP
Primary Stack: Next.js + React + Framer Motion + FastAPI + Slither + LLM
Current Scope: Phase 0 / Initial Project Setup + Frontend Foundation
Document Status: Initial baseline for step-by-step implementation

1. Product Overview

1.1 Problem

Smart contracts automate financial and operational actions on blockchain networks. A security bug in a smart contract can lead to unauthorized actions, loss of funds, or unexpected behavior.

Manual security review requires specialist knowledge and can take significant time. The product should make common vulnerability detection easier for developers while also explaining findings in simple language and suggesting possible fixes.

1.2 Product Idea

Build a web application where a developer can:

Paste or upload Solidity smart-contract code.

Run an automated security scan.

See detected vulnerabilities and their severity.

Jump to the affected code line.

Ask an AI layer to explain the finding in plain language.

View a suggested remediation/code patch.

Compare the original and suggested secure code.

1.3 One-line Product Definition

A developer-friendly smart-contract security workspace that combines static analysis with AI-assisted explanation and patch suggestions.

2. Goals

2.1 Primary Goals

Detect common Solidity smart-contract vulnerabilities.

Make security findings understandable to non-security specialists.

Highlight the exact vulnerable function/line where possible.

Provide severity and an overall security score.

Generate an AI-assisted explanation for each finding.

Generate a suggested fix or code diff.

Present everything through a clean, premium developer-focused UI.

2.2 Hackathon MVP Goals

The MVP should prove this flow end-to-end:

Solidity Code
     ↓
Security Scan
     ↓
Vulnerability Results
     ↓
Severity + Location
     ↓
AI Explanation
     ↓
Suggested Patch
     ↓
Visual Report

2.3 Non-goals for the first MVP

Building a new Solidity compiler.

Building a complete blockchain security engine from scratch.

Guaranteeing that a contract is completely secure.

Supporting every blockchain language.

Automatically deploying a patched contract to mainnet.

Replacing professional security audits.

3. Target User

Primary User

Software developers building Solidity/EVM smart contracts who need a fast first-pass security review.

Secondary User

Students, hackathon teams, Web3 developers, and developers who understand Solidity but are not security specialists.

4. Core User Journey

Landing Page
     ↓
Paste / Upload Contract
     ↓
Analyze Contract
     ↓
Scanning State
     ↓
Security Report
     ├── Security Score
     ├── Severity Summary
     ├── Vulnerability List
     └── Code Location
              ↓
        Select Vulnerability
              ↓
      AI Explanation Panel
              ↓
        Suggested Patch
              ↓
      Original vs Fixed Code

5. Core MVP Features

F1. Solidity Code Input

The user can paste Solidity code into a code editor.

MVP

Syntax-friendly editor area.

File name display.

Sample contract button.

Clear/reset button.

Analyze button.

Later

.sol file upload.

Drag and drop.

GitHub repository import.

Multiple contract files.

F2. Static Security Analysis

Primary engine

Slither should be the core Solidity static-analysis engine for the MVP.

Conceptual flow:

Solidity Source
      ↓
Temporary .sol file
      ↓
Solidity compilation / dependency setup
      ↓
Slither
      ↓
Raw findings
      ↓
Internal normalized JSON

Initial vulnerability categories

The first version should focus on a manageable set of common/high-value findings supported by the selected scanner, such as:

Reentrancy-related issues

Access-control problems

Dangerous external calls

Unchecked call results

Arithmetic/security-related findings where applicable

Unsafe state-update patterns

Other high-confidence Slither detectors selected during implementation

The exact detector list should be finalized during the scanner integration phase rather than hard-coded into this PRD.

F3. Vulnerability Normalization

Scanner output should be converted to a predictable application format.

Example normalized finding

{
  "id": "VULN-001",
  "type": "reentrancy",
  "title": "Potential reentrancy",
  "severity": "high",
  "confidence": "high",
  "contract": "Payment.sol",
  "function": "withdraw",
  "lineStart": 42,
  "lineEnd": 48,
  "description": "External interaction occurs before the relevant state update.",
  "recommendation": "Follow a checks-effects-interactions pattern and consider a reentrancy guard."
}

6. Security Score

The frontend should show a simple score such as:

Security Score: 72 / 100

The score is a product-level risk indicator, not an official security certification.

Initial scoring idea

Start at 100 and subtract weighted penalties based on finding severity.

Example concept:

Critical   → large penalty
High       → medium-large penalty
Medium     → medium penalty
Low        → small penalty
Info       → no/very small penalty

Exact weights will be defined during the analysis engine phase.

7. AI Explanation Layer

The LLM should not be the primary source of truth for vulnerability detection in the MVP.

The scanner provides the finding; the LLM explains it and assists with remediation.

Input to AI

- Vulnerability type
- Scanner description
- Relevant Solidity code
- Relevant function
- Line context
- Severity
- Recommended security pattern

AI output

What is the problem?
Why is it dangerous?
What could an attacker potentially do?
How should the developer fix it?

Example

Reentrancy detected.

The function performs an external value transfer before updating
its internal state. A malicious contract may call the function
again before the original state update completes.

Recommended approach:
Update the state before the external interaction and consider
using a reentrancy guard.

8. AI-Assisted Code Patching

The patching feature should generate a suggested correction, not silently overwrite the source.

Expected flow

Original Code
     ↓
Finding + Context
     ↓
LLM Patch Generator
     ↓
Suggested Secure Code
     ↓
Diff View
     ↓
Developer Review

UI requirements

Original code.

Suggested code.

Highlighted changes.

Explanation of why the change was made.

Copy patch button.

Optional future "Apply Patch" action.

Safety rule

The product must clearly label AI-generated patches as suggested and encourage developer review.

9. Frontend Requirements

9.1 Design Direction

The application should feel like a modern developer security product rather than a generic dashboard.

Visual direction

Dark developer-first interface.

Strong contrast.

Minimal but polished cards.

Clear red/orange/yellow severity indicators.

Subtle gradients.

Smooth transitions.

Code editor as the main visual focus.

Professional security-console feel.

Animation philosophy

Framer Motion should be used for:

Page entrance.

Card reveal.

Scan progress transition.

Security score reveal.

Vulnerability list stagger animation.

Hover/press interactions.

Modal/panel transitions.

Animations should support usability and must not become distracting.

10. Initial Frontend Page

The first page to build is a single-page analyzer workspace.

Initial layout

┌────────────────────────────────────────────────────────────────────┐
│  Shield / Logo       ContractGuard       Dashboard   Docs   GitHub │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│     SMART CONTRACT SECURITY WORKSPACE                              │
│     Scan Solidity code. Understand the risk. Fix it faster.        │
│                                                                    │
│  ┌────────────────────────────────┐  ┌──────────────────────────┐  │
│  │ CONTRACT CODE                  │  │ SECURITY OVERVIEW        │  │
│  │                                │  │                          │  │
│  │ 01 pragma solidity ^0.8.20;    │  │       100 / 100          │  │
│  │ 02                             │  │                          │  │
│  │ 03 contract Example {          │  │  ● Critical   0          │  │
│  │ 04     ...                     │  │  ● High       0          │  │
│  │ 05 }                           │  │  ● Medium     0          │  │
│  │                                │  │  ● Low        0          │  │
│  │                                │  │                          │  │
│  │ [Load sample] [Clear]          │  │  Ready to analyze        │  │
│  └────────────────────────────────┘  └──────────────────────────┘  │
│                                                                    │
│                 [ Analyze Contract ]                              │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘

This is intentionally only the foundation screen. Detailed findings, AI explanation, and diff view will be added in later phases.

11. Recommended Technical Architecture

11.1 High-level architecture

                         ┌──────────────────────────┐
                         │        Next.js App       │
                         │     React + Framer       │
                         └────────────┬─────────────┘
                                      │
                              REST / JSON API
                                      │
                                      ▼
                         ┌──────────────────────────┐
                         │      FastAPI Backend     │
                         └────────────┬─────────────┘
                                      │
                 ┌────────────────────┼───────────────────┐
                 │                    │                   │
                 ▼                    ▼                   ▼
        ┌────────────────┐   ┌────────────────┐  ┌────────────────┐
        │ Scanner Layer  │   │ AI Layer       │  │ File/Compiler  │
        │    Slither     │   │ Explainer      │  │ Utilities      │
        │                │   │ Patch Generator│  │                │
        └───────┬────────┘   └────────────────┘  └────────────────┘
                │
                ▼
        Normalized Findings
                │
                └──────────────► Backend API ◄───────────── AI
                                      │
                                      ▼
                              Frontend Security UI

12. Repository / File Architecture

12.1 Recommended complete project structure

smart-contract-security/
│
├── frontend/                         # Next.js + React + Framer Motion
│   ├── public/
│   │   ├── logo.svg
│   │   └── icons/
│   │
│   ├── src/
│   │   ├── app/
│   │   │   ├── globals.css
│   │   │   ├── layout.jsx
│   │   │   └── page.jsx
│   │   │
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── CodeEditor.jsx
│   │   │   ├── SecurityOverview.jsx
│   │   │   ├── AnalyzeButton.jsx
│   │   │   ├── VulnerabilityList.jsx
│   │   │   ├── VulnerabilityCard.jsx
│   │   │   ├── SecurityScore.jsx
│   │   │   ├── AIExplanation.jsx
│   │   │   └── CodeDiff.jsx
│   │   │
│   │   ├── lib/
│   │   │   └── api.js
│   │   │
│   │   └── data/
│   │       └── sampleContract.js
│   │
│   ├── package.json
│   ├── next.config.mjs
│   └── jsconfig.json
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   │
│   │   ├── api/
│   │   │   ├── analyze.py
│   │   │   ├── explain.py
│   │   │   └── patch.py
│   │   │
│   │   ├── scanner/
│   │   │   ├── slither_runner.py
│   │   │   ├── parser.py
│   │   │   └── severity.py
│   │   │
│   │   ├── ai/
│   │   │   ├── explainer.py
│   │   │   ├── patch_generator.py
│   │   │   └── prompts.py
│   │   │
│   │   ├── models/
│   │   │   └── schemas.py
│   │   │
│   │   └── utils/
│   │       ├── compiler.py
│   │       └── file_handler.py
│   │
│   ├── requirements.txt
│   └── Dockerfile
│
├── contracts/
│   ├── vulnerable/
│   │   ├── Reentrancy.sol
│   │   ├── AccessControl.sol
│   │   └── UncheckedCall.sol
│   │
│   └── secure/
│       └── SecureExample.sol
│
├── tests/
│   ├── test_scanner.py
│   ├── test_parser.py
│   └── test_api.py
│
├── .env.example
├── .gitignore
├── docker-compose.yml
└── README.md

13. Initial Project File Structure — Phase 0

Do not create the full architecture immediately. The first project commit should stay small.

smart-contract-security/
│
├── frontend/
│   ├── src/
│   │   └── app/
│   │       ├── globals.css
│   │       ├── layout.jsx
│   │       └── page.jsx
│   │   └── components/
│   │       └── AnalyzerShell.jsx
│   ├── package.json
│   └── next.config.mjs
│
├── backend/
│   ├── main.py
│   └── requirements.txt
│
├── contracts/
│   └── sample.sol
│
├── .env.example
├── .gitignore
└── README.md

Reason

This keeps the first Git commit easy to understand and reduces merge conflicts when three teammates start working in parallel.

Later phases can expand the folders without reorganizing the entire repository.

14. Initial Next.js Frontend Code

The following code is the Phase 0 visual foundation only. It does not call the backend yet.

14.1 frontend/src/app/layout.jsx

import "./globals.css";

export const metadata = {
  title: "ContractGuard",
  description: "Smart contract vulnerability detection and AI-assisted patching",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

14.2 frontend/src/app/page.jsx

"use client";

import { motion } from "framer-motion";
import AnalyzerShell from "../components/AnalyzerShell";

export default function HomePage() {
  return (
    <main className="page-shell">
      <motion.div
        className="ambient ambient-one"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2 }}
      />

      <motion.div
        className="ambient ambient-two"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, delay: 0.2 }}
      />

      <motion.header
        className="navbar"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="brand">
          <div className="brand-mark">S</div>
          <div>
            <div className="brand-name">ContractGuard</div>
            <div className="brand-subtitle">Smart contract security</div>
          </div>
        </div>

        <nav className="nav-links">
          <a href="#analyzer">Analyzer</a>
          <a href="#how-it-works">How it works</a>
          <a href="#docs">Docs</a>
          <button className="github-button">GitHub</button>
        </nav>
      </motion.header>

      <section className="hero" id="analyzer">
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1 }}
        >
          <div className="eyebrow">SECURITY WORKSPACE</div>
          <h1>
            Find vulnerabilities.
            <span> Understand the risk.</span>
          </h1>
          <p>
            Analyze Solidity smart contracts, surface common security risks,
            and prepare AI-assisted remediation from one developer-focused workspace.
          </p>
        </motion.div>

        <AnalyzerShell />
      </section>

      <section className="feature-strip" id="how-it-works">
        {[
          ["01", "Static analysis", "Detect common Solidity security issues."],
          ["02", "AI explanation", "Turn technical findings into clear reasoning."],
          ["03", "Suggested patch", "Review an AI-assisted remediation."],
        ].map(([number, title, description], index) => (
          <motion.div
            className="feature-card"
            key={number}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
          >
            <div className="feature-number">{number}</div>
            <h3>{title}</h3>
            <p>{description}</p>
          </motion.div>
        ))}
      </section>
    </main>
  );
}

14.3 frontend/src/components/AnalyzerShell.jsx

"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const starterCode = `pragma solidity ^0.8.20;\n\ncontract Example {\n    mapping(address => uint256) public balances;\n\n    function deposit() external payable {\n        balances[msg.sender] += msg.value;\n    }\n\n    function withdraw(uint256 amount) external {\n        require(balances[msg.sender] >= amount, "Insufficient balance");\n        balances[msg.sender] -= amount;\n        payable(msg.sender).transfer(amount);\n    }\n}`;

export default function AnalyzerShell() {
  const [code, setCode] = useState(starterCode);
  const [status, setStatus] = useState("Ready to analyze");

  function handleAnalyze() {
    setStatus("Scanner connection will be added in the backend phase.");
  }

  function handleClear() {
    setCode("");
    setStatus("Editor cleared");
  }

  function handleLoadSample() {
    setCode(starterCode);
    setStatus("Sample contract loaded");
  }

  return (
    <motion.div
      className="analyzer-grid"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.25 }}
    >
      <div className="panel code-panel">
        <div className="panel-header">
          <div>
            <div className="panel-kicker">CONTRACT INPUT</div>
            <h2>SmartContract.sol</h2>
          </div>
          <span className="status-pill">Solidity</span>
        </div>

        <textarea
          value={code}
          onChange={(event) => setCode(event.target.value)}
          spellCheck="false"
          className="code-editor"
          aria-label="Solidity contract editor"
        />

        <div className="editor-actions">
          <button onClick={handleLoadSample}>Load sample</button>
          <button onClick={handleClear}>Clear</button>
        </div>
      </div>

      <div className="panel overview-panel">
        <div className="panel-header">
          <div>
            <div className="panel-kicker">SECURITY OVERVIEW</div>
            <h2>Scan status</h2>
          </div>
          <div className="ready-dot" />
        </div>

        <div className="score-block">
          <div className="score">100</div>
          <div className="score-label">/ 100</div>
        </div>

        <div className="severity-list">
          <div><span className="severity critical" />Critical <strong>0</strong></div>
          <div><span className="severity high" />High <strong>0</strong></div>
          <div><span className="severity medium" />Medium <strong>0</strong></div>
          <div><span className="severity low" />Low <strong>0</strong></div>
        </div>

        <div className="status-box">{status}</div>
      </div>

      <motion.button
        className="analyze-button"
        onClick={handleAnalyze}
        whileHover={{ y: -2, scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        Analyze Contract
        <span>→</span>
      </motion.button>
    </motion.div>
  );
}

14.4 frontend/src/app/globals.css

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background: #07101a;
  color: #eef5ff;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

button,
textarea {
  font: inherit;
}

button {
  cursor: pointer;
}

.page-shell {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background:
    radial-gradient(circle at 20% 10%, rgba(52, 211, 153, 0.08), transparent 30%),
    radial-gradient(circle at 85% 20%, rgba(59, 130, 246, 0.08), transparent 30%),
    #07101a;
}

.ambient {
  position: absolute;
  width: 420px;
  height: 420px;
  border-radius: 50%;
  filter: blur(90px);
  pointer-events: none;
}

.ambient-one {
  top: -180px;
  left: -150px;
  background: rgba(22, 163, 74, 0.08);
}

.ambient-two {
  top: 280px;
  right: -160px;
  background: rgba(37, 99, 235, 0.08);
}

.navbar {
  position: relative;
  z-index: 2;
  width: min(1180px, calc(100% - 40px));
  margin: 0 auto;
  padding: 24px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

.brand {
  display: flex;
  gap: 12px;
  align-items: center;
}

.brand-mark {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 11px;
  background: linear-gradient(135deg, #e8fff6, #7cf3c2);
  color: #07101a;
  font-weight: 900;
}

.brand-name {
  font-weight: 800;
  letter-spacing: -0.02em;
}

.brand-subtitle {
  margin-top: 2px;
  color: #718096;
  font-size: 12px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 24px;
}

.nav-links a {
  color: #9eabba;
  text-decoration: none;
  font-size: 14px;
}

.github-button,
.editor-actions button {
  border: 1px solid rgba(255, 255, 255, 0.09);
  background: rgba(255, 255, 255, 0.04);
  color: #d7e0eb;
  border-radius: 10px;
  padding: 9px 13px;
}

.hero {
  position: relative;
  z-index: 1;
  width: min(1180px, calc(100% - 40px));
  margin: 0 auto;
  padding: 76px 0 40px;
}

.hero-copy {
  max-width: 760px;
  margin-bottom: 42px;
}

.eyebrow,
.panel-kicker {
  color: #65e6b1;
  letter-spacing: 0.18em;
  font-size: 11px;
  font-weight: 800;
}

.hero h1 {
  margin: 14px 0;
  font-size: clamp(42px, 6vw, 76px);
  line-height: 0.98;
  letter-spacing: -0.055em;
}

.hero h1 span {
  display: block;
  color: #8290a1;
}

.hero p {
  max-width: 680px;
  margin: 22px 0 0;
  color: #8f9dad;
  font-size: 17px;
  line-height: 1.7;
}

.analyzer-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(300px, 0.65fr);
  gap: 16px;
}

.panel {
  background: rgba(10, 20, 32, 0.82);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  backdrop-filter: blur(18px);
  box-shadow: 0 20px 70px rgba(0, 0, 0, 0.18);
}

.code-panel,
.overview-panel {
  min-height: 520px;
}

.panel-header {
  padding: 20px 22px 15px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.panel-header h2 {
  margin: 7px 0 0;
  font-size: 16px;
}

.status-pill {
  padding: 6px 9px;
  border-radius: 999px;
  color: #8af0c7;
  background: rgba(52, 211, 153, 0.08);
  font-size: 11px;
}

.code-editor {
  display: block;
  width: calc(100% - 24px);
  min-height: 390px;
  margin: 0 12px;
  padding: 18px;
  resize: vertical;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  outline: none;
  background: #06101a;
  color: #d9e7f4;
  font-family: "JetBrains Mono", "Cascadia Code", Consolas, monospace;
  font-size: 13px;
  line-height: 1.75;
}

.code-editor:focus {
  border-color: rgba(101, 230, 177, 0.4);
}

.editor-actions {
  display: flex;
  gap: 10px;
  padding: 12px 20px 20px;
}

.score-block {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 42px 24px 30px;
}

.score {
  font-size: 76px;
  line-height: 1;
  font-weight: 850;
  letter-spacing: -0.06em;
}

.score-label {
  color: #6f7d8e;
  font-size: 16px;
}

.severity-list {
  display: grid;
  gap: 14px;
  padding: 0 24px 24px;
}

.severity-list > div {
  display: flex;
  gap: 10px;
  align-items: center;
  color: #a7b4c2;
  font-size: 14px;
}

.severity-list strong {
  margin-left: auto;
  color: #eaf1f8;
}

.severity {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.critical { background: #ff5b68; }
.high { background: #ff9f43; }
.medium { background: #ffd166; }
.low { background: #65e6b1; }

.ready-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #65e6b1;
  box-shadow: 0 0 18px rgba(101, 230, 177, 0.6);
}

.status-box {
  margin: 8px 24px 24px;
  padding: 13px 14px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  color: #738296;
  font-size: 12px;
  line-height: 1.55;
}

.analyze-button {
  grid-column: 1 / -1;
  margin-top: 2px;
  min-height: 58px;
  border: 1px solid rgba(126, 255, 204, 0.22);
  border-radius: 15px;
  background: linear-gradient(135deg, #b8ffe4, #72efbc);
  color: #06120d;
  font-weight: 850;
  box-shadow: 0 12px 40px rgba(101, 230, 177, 0.12);
}

.analyze-button span {
  margin-left: 8px;
}

.feature-strip {
  position: relative;
  z-index: 1;
  width: min(1180px, calc(100% - 40px));
  margin: 20px auto 80px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.feature-card {
  padding: 22px;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.025);
}

.feature-number {
  color: #627184;
  font-family: monospace;
  font-size: 12px;
}

.feature-card h3 {
  margin: 25px 0 8px;
  font-size: 16px;
}

.feature-card p {
  margin: 0;
  color: #798798;
  line-height: 1.6;
  font-size: 13px;
}

@media (max-width: 900px) {
  .nav-links a {
    display: none;
  }

  .analyzer-grid,
  .feature-strip {
    grid-template-columns: 1fr;
  }

  .code-panel,
  .overview-panel {
    min-height: auto;
  }
}

15. Initial Backend Stub

For Phase 0, the backend only needs to verify that the frontend can communicate with FastAPI.

backend/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="ContractGuard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "service": "contractguard-api",
    }

This is intentionally minimal. Slither integration should be added in the next phase.

16. Initial Contract Example

contracts/sample.sol

pragma solidity ^0.8.20;

contract Example {
    mapping(address => uint256) public balances;

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
    }
}

This contract is only a UI/testing fixture at Phase 0. The scanner phase should introduce intentionally vulnerable contracts and verified test cases.

17. Frontend Dependencies

The frontend MVP is expected to use:

next
react
react-dom
framer-motion

Later, a dedicated code editor can be introduced, such as Monaco-based editing, once the base workflow is working.

18. Backend Dependencies — Initial

Phase 0 can remain minimal:

fastapi
uvicorn

Later phases are expected to add:

slither-analyzer
solc / Solidity compiler tooling
LLM provider SDK
pydantic

The exact versions should be pinned when the implementation environment is created.

19. API Contract — Planned

Analyze Contract

POST /api/analyze

Request

{
  "filename": "SmartContract.sol",
  "code": "pragma solidity ^0.8.20; ..."
}

Planned response

{
  "score": 72,
  "summary": {
    "critical": 1,
    "high": 2,
    "medium": 2,
    "low": 1
  },
  "findings": [
    {
      "id": "VULN-001",
      "type": "reentrancy",
      "title": "Potential reentrancy",
      "severity": "high",
      "lineStart": 42,
      "lineEnd": 48,
      "function": "withdraw",
      "description": "..."
    }
  ]
}

Explain Finding

POST /api/explain

Planned request:

{
  "code": "...",
  "finding": {
    "type": "reentrancy",
    "severity": "high",
    "lineStart": 42,
    "lineEnd": 48
  }
}

Generate Patch

POST /api/patch

Planned response:

{
  "original": "...",
  "patched": "...",
  "diff": "...",
  "explanation": "..."
}

These APIs are planned contracts; backend implementation comes in later phases.

20. Team Architecture

For a 3-person team, use clear ownership while keeping a common API contract.

Member 1 — Security / Backend

Owns:

backend/app/scanner/
backend/app/api/analyze.py
contracts/
tests/

Member 2 — AI / Remediation

Owns:

backend/app/ai/
backend/app/api/explain.py
backend/app/api/patch.py

Member 3 — Frontend / UX

Owns:

frontend/src/

Shared

README.md
.env.example
API schemas / integration contract

Avoid having multiple people edit the same core files simultaneously.

21. Git Strategy

Recommended branch structure:

main
│
├── feat/frontend-foundation
├── feat/slither-scanner
└── feat/ai-explanation

Use small commits such as:

feat: create analyzer workspace
feat: add FastAPI health endpoint
feat: integrate Slither runner
feat: normalize scanner findings
feat: add AI explanation endpoint
feat: add vulnerability report UI

Do not commit .env or API keys.

22. Environment Variables

.env.example

NEXT_PUBLIC_API_URL=http://localhost:8000
LLM_API_KEY=replace_me

Actual secret values must stay in local .env files and must not be committed.

23. Phase Plan

This PRD intentionally stops at the project foundation. Implementation should proceed phase by phase rather than building everything simultaneously.

Phase 0 — Project Bootstrap

Goal: Get the repository, Next.js frontend, Framer Motion UI, FastAPI backend, and health endpoint running.

Deliverables:

Git repository.

Initial folder structure.

Next.js application.

Framer Motion installed.

Landing/analyzer page working.

FastAPI running.

/api/health working.

Sample Solidity contract loaded in UI.

Phase 1 — Slither Integration

Goal: Make the Analyze button perform a real static analysis.

Deliverables:

Solidity temporary-file handling.

Slither runner.

Parsed JSON findings.

Severity mapping.

Basic /api/analyze endpoint.

Real scanner results rendered in frontend.

Phase 2 — Security Report UI

Goal: Make findings visually useful.

Deliverables:

Security score.

Severity counters.

Vulnerability cards.

Code line highlighting.

Finding filtering.

Loading/scanning animation.

Phase 3 — AI Explanation

Goal: Turn scanner output into understandable explanations.

Deliverables:

AI explanation endpoint.

Prompt templates.

Finding-specific explanation panel.

Attack-scenario explanation.

Remediation guidance.

Phase 4 — AI Patch Generation

Goal: Generate and review suggested code changes.

Deliverables:

Patch generator.

Diff view.

Original vs suggested code.

Copy patch action.

Clear AI-generated label.

Phase 5 — Premium UX / Hackathon Polish

Goal: Make the project feel competition-ready.

Potential refinements:

Monaco code editor.

Better code syntax highlighting.

Animated security score.

Finding reveal animations.

Interactive line navigation.

Empty/loading/error states.

Responsive layout.

Demo/sample contracts.

Security report export.

Product branding and final polish.

24. MVP Acceptance Criteria

The MVP is considered successful when a user can:

Open the web app.

Paste or load Solidity code.

Click Analyze Contract.

The backend runs static analysis.

Vulnerabilities appear in the UI.

Each finding has a severity and location when available.

The user can select a finding.

The system generates a plain-language explanation.

The system can produce a suggested patch for supported findings.

The user can visually compare original and suggested code.

25. Demo Story for Judges

The final hackathon demo should tell one simple story:

1. Here is a vulnerable contract.
        ↓
2. We scan it automatically.
        ↓
3. We found a high-risk issue on this line.
        ↓
4. Here is what the issue means in simple language.
        ↓
5. Here is how an attacker could abuse the pattern.
        ↓
6. Here is an AI-assisted secure patch.
        ↓
7. Here is the before/after code.

The key message is:

We are not trying to make AI magically "audit" smart contracts. We combine deterministic code analysis with AI-assisted understanding and remediation.

26. Success Metrics for the Hackathon

Track simple product metrics rather than vague claims:

Time from code submission to first scan result.

Number of supported vulnerability classes in the demo.

Finding-to-line mapping accuracy.

Percentage of findings with understandable explanations.

Patch generation success rate on the demo test set.

UI response time during demo flows.

Never claim that the application proves a contract is secure; present it as an assistive security-analysis tool.

27. Initial Definition of Done — Phase 0

Before moving to Phase 1, confirm:

[ ] Git repository created
[ ] frontend/ created
[ ] backend/ created
[ ] Next.js page runs locally
[ ] Framer Motion animations work
[ ] Sample Solidity code displays
[ ] Analyze button responds
[ ] FastAPI runs locally
[ ] /api/health returns OK
[ ] Frontend can reach backend
[ ] .env.example created
[ ] .gitignore created
[ ] README contains setup instructions

28. Important Implementation Principles

Principle 1 — Detection first, AI second

Use static analysis to establish the finding. Use AI to explain and remediate.

Principle 2 — High-confidence results matter more than lots of noisy results

A smaller set of useful findings makes a better hackathon demo than a long list of confusing warnings.

Principle 3 — Never silently mutate source code

Patches should be proposed and reviewed.

Principle 4 — Keep the frontend/backend contract stable

Define the JSON schema early so the three teammates can work independently.

Principle 5 — Build the end-to-end happy path first

The priority is:

Input → Scan → Result → Explain → Patch

Only after this works should the team spend significant time on extra animations, additional scanners, authentication, databases, or deployment complexity.

29. Current Phase Boundary

This PRD is intentionally the baseline only.

At this stage, the team should build:

Project structure
      ↓
Next.js + React + Framer Motion UI
      ↓
FastAPI skeleton
      ↓
Frontend ↔ Backend connectivity

The next implementation phase should focus specifically on Slither installation, Solidity compilation, scanner execution, result parsing, and the /api/analyze endpoint.

Do not start AI patching, authentication, databases, deployment, or advanced analytics until the scanner pipeline works end-to-end.