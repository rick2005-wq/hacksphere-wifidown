"use client";

import { useRef, useEffect } from "react";

export default function CodeEditor({ code, onChange, highlightRange }) {
    const textareaRef = useRef(null);
    const bgRef = useRef(null);

    const handleScroll = (e) => {
        if (bgRef.current) {
            bgRef.current.scrollTop = e.target.scrollTop;
            bgRef.current.scrollLeft = e.target.scrollLeft;
        }
    };

    const lines = code.split('\n');
    let start = null;
    let end = null;

    if (highlightRange && highlightRange[0] != null) {
        start = parseInt(highlightRange[0]);
        end = highlightRange[1] != null ? parseInt(highlightRange[1]) : start;
    }

    useEffect(() => {
        if (start !== null && bgRef.current && textareaRef.current) {
            const lineHeight = 22.75;
            const y = (start - 1) * lineHeight;
            const scrollTarget = y > 60 ? y - 60 : 0;

            textareaRef.current.scrollTo({ top: scrollTarget, behavior: 'smooth' });
            bgRef.current.scrollTo({ top: scrollTarget, behavior: 'smooth' });
        }
    }, [start]);

    return (
        <div style={{
            position: 'relative',
            margin: '0 12px',
            width: 'calc(100% - 24px)',
            height: '420px',
            borderRadius: '14px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            background: '#06101a',
            overflow: 'hidden'
        }}>
            <div
                ref={bgRef}
                style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    padding: '18px',
                    fontFamily: '"JetBrains Mono", "Cascadia Code", Consolas, monospace',
                    fontSize: '13px',
                    lineHeight: '1.75',
                    overflow: 'hidden',
                    whiteSpace: 'pre',
                    color: 'transparent',
                    pointerEvents: 'none',
                    textAlign: 'left'
                }}
            >
                {lines.map((line, i) => {
                    const lineNum = i + 1;
                    const isHighlighted = start !== null && lineNum >= start && lineNum <= end;
                    return (
                        <div key={i} style={{
                            backgroundColor: isHighlighted ? 'rgba(255, 91, 104, 0.25)' : 'transparent',
                            borderRadius: '3px',
                            display: 'inline-block',
                            minWidth: '100%',
                            padding: '0 4px',
                            marginLeft: '-4px'
                        }}>
                            {line === '' ? ' ' : line}
                        </div>
                    );
                })}
            </div>

            <textarea
                ref={textareaRef}
                value={code}
                onChange={onChange}
                onScroll={handleScroll}
                spellCheck="false"
                wrap="off"
                aria-label="Solidity contract editor"
                style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    width: '100%',
                    height: '100%',
                    padding: '18px',
                    margin: 0,
                    background: 'transparent',
                    color: '#d9e7f4',
                    fontFamily: '"JetBrains Mono", "Cascadia Code", Consolas, monospace',
                    fontSize: '13px',
                    lineHeight: '1.75',
                    border: 'none',
                    outline: 'none',
                    resize: 'none',
                    whiteSpace: 'pre'
                }}
            />
        </div>
    );
}
