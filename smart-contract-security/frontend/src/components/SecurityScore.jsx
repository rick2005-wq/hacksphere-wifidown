"use client";

import { motion } from "framer-motion";

export default function SecurityScore({ state }) {
    if (state === "loading") {
        return (
            <div className="score-block">
                <div className="score-label" style={{ fontSize: '18px', fontWeight: 600 }}>Scanning...</div>
            </div>
        );
    }
    if (state === "success") {
        return (
            <div className="score-block">
                <div className="score" style={{ fontSize: '36px', height: 'auto', marginTop: '12px', marginBottom: '8px' }}>Analysis<br />complete</div>
            </div>
        );
    }
    return (
        <div className="score-block">
            <div className="score-label" style={{ fontSize: '18px', fontWeight: 600 }}>Score pending</div>
        </div>
    );
}
