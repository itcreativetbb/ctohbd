import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
    const [text, setText] = useState('');
    const [showCursor, setShowCursor] = useState(true);
    const fullText = [
        "npx celebrate-birthday --user full-stack-dev",
        "npm install --save happiness@latest",
        "git clone https://github.com/ElormOscar/My30thBirthday.git"
    ];
    const [lineIndex, setLineIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);

    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const targetDate = new Date('2026-02-03T00:00:00');

        const interval = setInterval(() => {
            const now = new Date();
            const difference = targetDate - now;

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);

                setTimeLeft({ days, hours, minutes, seconds });
            } else {
                clearInterval(interval);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (lineIndex < fullText.length) {
            if (charIndex < fullText[lineIndex].length) {
                const timeout = setTimeout(() => {
                    setText(prev => {
                        const currentLines = prev.split('\n');
                        currentLines[lineIndex] = fullText[lineIndex].substring(0, charIndex + 1);
                        return currentLines.join('\n');
                    });
                    setCharIndex(prev => prev + 1);
                }, 50); // Typing speed
                return () => clearTimeout(timeout);
            } else {
                const timeout = setTimeout(() => {
                    if (lineIndex < fullText.length - 1) {
                        setText(prev => prev + '\n');
                        setLineIndex(prev => prev + 1);
                        setCharIndex(0);
                    }
                }, 1000); // Pause between lines
                return () => clearTimeout(timeout);
            }
        }
    }, [charIndex, lineIndex, fullText]);

    return (
        <header className="flex flex-col items-center justify-center min-h-[80vh] py-10 space-y-12">
            {/* Terminal Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-3xl bg-[#161b22] border border-[#30363d] rounded-lg shadow-2xl overflow-hidden box-glow"
            >
                <div className="flex items-center px-4 py-2 bg-[#0d1117] border-b border-[#30363d]">
                    <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                    </div>
                    <div className="ml-4 text-xs text-gray-400 font-mono">bash</div>
                </div>
                <div className="p-6 font-mono text-sm md:text-base text-gray-300 min-h-[200px]">
                    {text.split('\n').map((line, i) => (
                        <div key={i} className="mb-2">
                            <span className="text-accent mr-2">$</span>
                            <span className="break-all">{line}</span>
                            {i === lineIndex && (
                                <span className="inline-block w-2.5 h-5 bg-accent ml-1 animate-cursor-blink align-middle"></span>
                            )}
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Hero Title and Countdown */}
            <div className="text-center space-y-8 px-4 w-full">
                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="font-bold font-sans tracking-tight leading-tight"
                    style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)" }}
                >
                    Full-Stack Dev Birthday <span className="text-accent underline decoration-4 decoration-accent/30">v3.0.0</span>
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto"
                >
                    {Object.entries(timeLeft).map(([label, value]) => (
                        <div key={label} className="bg-[#161b22]/80 backdrop-blur-md border border-[#30363d] p-4 rounded-xl text-center glow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 box-glow-hover">
                            <div className="font-mono font-bold text-white mb-2" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
                                {String(value).padStart(2, '0')}
                            </div>
                            <div className="text-xs uppercase tracking-widest text-gray-500">{label}</div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </header>
    );
};

export default Hero;
