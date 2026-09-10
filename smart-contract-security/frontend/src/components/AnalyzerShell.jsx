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
