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
