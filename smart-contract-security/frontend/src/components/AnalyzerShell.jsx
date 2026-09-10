"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { analyzeContract } from "../lib/api";
import SecurityScore from "./SecurityScore";
import VulnerabilityCard from "./VulnerabilityCard";
import VulnerabilityDetails from "./VulnerabilityDetails";
import CodeEditor from "./CodeEditor";

const starterCode = `pragma solidity ^0.8.20;\n\ncontract Example {\n    mapping(address => uint256) public balances;\n\n    function deposit() external payable {\n        balances[msg.sender] += msg.value;\n    }\n\n    function withdraw(uint256 amount) external {\n        require(balances[msg.sender] >= amount, "Insufficient balance");\n        balances[msg.sender] -= amount;\n        payable(msg.sender).transfer(amount);\n    }\n}`;

export default function AnalyzerShell() {
    const [code, setCode] = useState(starterCode);
    const [status, setStatus] = useState("Ready to analyze");

    const [appState, setAppState] = useState("idle"); // idle, loading, success, error
    const [errorMsg, setErrorMsg] = useState(null);
    const [summary, setSummary] = useState({
        critical: 0, high: 0, medium: 0, low: 0, total: 0, informational: 0
    });

    const [findings, setFindings] = useState([]);
    const [selectedFinding, setSelectedFinding] = useState(null);

    async function handleAnalyze() {
        if (!code || !code.trim()) {
            setErrorMsg("Code cannot be empty");
            return;
        }

        setAppState("loading");
        setStatus("Analyzing contract...");
        setErrorMsg(null);
        setSummary({ critical: 0, high: 0, medium: 0, low: 0, total: 0, informational: 0 });
        setFindings([]);
        setSelectedFinding(null);

        try {
            const result = await analyzeContract(code);

            if (result.success && result.analysis_status === "completed") {
                const fetchedFindings = result.findings || [];
                setAppState("success");

                if (fetchedFindings.length === 0) {
                    setStatus("No findings detected by the configured Slither analysis.");
                } else {
                    setStatus("Analysis completed");
                }

                setSummary(result.summary || { critical: 0, high: 0, medium: 0, low: 0, total: 0, informational: 0 });
                setFindings(fetchedFindings);
            } else {
                setAppState("error");
                setStatus("Analysis failed");
                setErrorMsg(result.error || "Execution failed on the backend.");
            }
        } catch (err) {
            setAppState("error");
            setStatus("Network error");
            setErrorMsg(err.message || "Failed to reach backend API.");
        }
    }

    function handleClear() {
        setCode("");
        setStatus("Editor cleared");
        setAppState("idle");
        setErrorMsg(null);
        setSummary({ critical: 0, high: 0, medium: 0, low: 0, total: 0, informational: 0 });
        setFindings([]);
        setSelectedFinding(null);
    }

    function handleLoadSample() {
        setCode(starterCode);
        setStatus("Sample contract loaded");
        setAppState("idle");
        setErrorMsg(null);
        setSummary({ critical: 0, high: 0, medium: 0, low: 0, total: 0, informational: 0 });
        setFindings([]);
        setSelectedFinding(null);
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

                <CodeEditor
                    code={code}
                    onChange={(event) => setCode(event.target.value)}
                    highlightRange={[selectedFinding?.lineStart, selectedFinding?.lineEnd]}
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
                    <div className={`ready-dot ${appState === 'loading' ? 'loading' : ''}`} />
                </div>

                <SecurityScore state={appState} />

                <div className="severity-list">
                    <div><span className="severity critical" />Critical <strong>{summary.critical}</strong></div>
                    <div><span className="severity high" />High <strong>{summary.high}</strong></div>
                    <div><span className="severity medium" />Medium <strong>{summary.medium}</strong></div>
                    <div><span className="severity low" />Low <strong>{summary.low}</strong></div>
                    <div><span className="severity informational" style={{ background: '#8290a1' }} />Informational <strong>{summary.informational || 0}</strong></div>
                </div>

                {errorMsg && (
                    <div style={{ color: '#ff5b68', margin: '0 24px 10px 24px', fontSize: '13px' }}>
                        {errorMsg}
                    </div>
                )}

                <div className="status-box">{status}</div>
            </div>

            <motion.button
                className="analyze-button"
                onClick={handleAnalyze}
                disabled={appState === "loading"}
                whileHover={appState !== "loading" ? { y: -2, scale: 1.01 } : {}}
                whileTap={appState !== "loading" ? { scale: 0.99 } : {}}
                style={{ opacity: appState === "loading" ? 0.7 : 1 }}
            >
                {appState === "loading" ? "Analyzing contract..." : "Analyze Contract"}
                <span>→</span>
            </motion.button>

            {appState === "success" && (
                <div className="findings-container">
                    {findings.length === 0 ? (
                        <div className="empty-state">
                            No findings detected by the configured Slither analysis.
                        </div>
                    ) : (
                        <>
                            <div className="findings-list">
                                {findings.map(f => (
                                    <VulnerabilityCard
                                        key={f.id}
                                        finding={f}
                                        isSelected={selectedFinding?.id === f.id}
                                        onClick={setSelectedFinding}
                                    />
                                ))}
                            </div>
                            <div>
                                <VulnerabilityDetails finding={selectedFinding} />
                            </div>
                        </>
                    )}
                </div>
            )}
        </motion.div>
    );
}
