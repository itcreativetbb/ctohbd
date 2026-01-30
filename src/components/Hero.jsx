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
        // Use explicit date construction to avoid timezone ambiguity (Year, MonthIndex, Day)
        const targetDate = new Date(2026, 1, 3, 0, 0, 0); // Feb 3rd 2026

        const interval = setInterval(() => {
            const now = new Date();
            const difference = targetDate - now;

            if (difference > 0) {
                // Use ceil for days to include partial days as a "full" day in the count
                const days = Math.floor(difference / (1000 * 60 * 60 * 24)) + 1;
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
        <header className="relative flex flex-col items-center justify-center min-h-[90vh] py-20 overflow-hidden">

            {/* Blended Background Image - Magic Transformation */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#0d1117] via-[#0d1117]/80 to-transparent z-10"></div>
                <div className="absolute bottom-0 right-0 w-full md:w-1/2 h-full z-0 opacity-60 mix-blend-screen grayscale-[20%]">
                    <img
                        src="/images/elorm-hero.jpg"
                        alt="Elorm Oscar"
                        className="w-full h-full object-cover object-top mask-image-gradient"
                        style={{
                            maskImage: 'linear-gradient(to left, black 40%, transparent 100%)',
                            WebkitMaskImage: 'linear-gradient(to left, black 40%, transparent 100%)'
                        }}
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-transparent to-transparent z-10"></div>
            </div>

            <div className="relative z-20 w-full max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">

                {/* Text Content - Left Side */}
                <div className="space-y-8">
                    <motion.h1
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="font-bold font-sans tracking-tight leading-tight text-left"
                        style={{ fontSize: "clamp(3rem, 6vw, 5rem)" }}
                    >
                        Refactoring the Past, <br />
                        Optimizing the <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-500">Present</span> <br />
                        & Deploying the <span className="text-accent underline decoration-4 decoration-accent/30">Future</span>
                    </motion.h1>

                    {/* Countdown */}
                    <div className="grid grid-cols-4 gap-4 max-w-lg">
                        {Object.entries(timeLeft).map(([label, value]) => {
                            if (label === 'days' || label === 'hours' || label === 'minutes' || label === 'seconds') { // safety
                                return (
                                    <div key={label} className="text-center">
                                        <div className="font-mono font-bold text-white text-2xl md:text-3xl">
                                            {String(value).padStart(2, '0')}
                                        </div>
                                        <div className="text-[10px] uppercase tracking-widest text-gray-500">{label}</div>
                                    </div>
                                )
                            }
                        })}
                    </div>
                </div>

                {/* Terminal - Right Side (Floating over image area but readable) */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="w-full bg-[#161b22]/90 backdrop-blur-sm border border-[#30363d] rounded-lg shadow-2xl overflow-hidden box-glow transform md:translate-y-12"
                >
                    <div className="flex items-center px-4 py-2 bg-[#0d1117] border-b border-[#30363d]">
                        <div className="flex space-x-2">
                            <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                            <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                        </div>
                        <div className="ml-4 text-xs text-gray-400 font-mono">bash ~ elorm-oscar</div>
                    </div>
                    <div className="p-6 font-mono text-sm md:text-base text-gray-300 min-h-[250px]">
                        {text.split('\n').map((line, i) => (
                            <div key={i} className="mb-2">
                                <span className="text-accent mr-2">$</span>
                                <span className="break-all">{line}</span>
                            </div>
                        ))}
                        <span className="inline-block w-2.5 h-5 bg-accent ml-1 animate-cursor-blink align-middle"></span>
                    </div>
                </motion.div>
            </div>
        </header>
    );
};

export default Hero;
