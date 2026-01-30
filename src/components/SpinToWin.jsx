import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, X, PartyPopper, ChevronRight, Palette, Code, Video, Download, Terminal, Zap, Briefcase, Sparkles } from 'lucide-react';

const prizes = [
    { id: 1, label: '1:1 Mentorship', icon: <Video size={16} />, color: '#7c3aed', link: 'https://cal.com/elormoscar' },
    { id: 2, label: 'Dev Course', icon: <Code size={16} />, color: '#db2777', link: '#' },
    { id: 3, label: 'UI Kit', icon: <Palette size={16} />, color: '#ea580c', link: '#' },
    { id: 4, label: 'Code Review', icon: <Terminal size={16} />, color: '#16a34a', link: '#' },
    { id: 5, label: 'Cloud Credits', icon: <Zap size={16} />, color: '#2563eb', link: '#' },
    { id: 6, label: 'Design Audit', icon: <Briefcase size={16} />, color: '#9333ea', link: '#' }, // Using generic icon
    { id: 7, label: 'Free Tools', icon: <Download size={16} />, color: '#0891b2', link: '#' },
    { id: 8, label: 'Mystery Gift', icon: <Sparkles size={16} />, color: '#f59e0b', link: '#' },
];

const SpinToWin = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [wonPrize, setWonPrize] = useState(null);

    const triggerConfetti = async () => {
        const confetti = (await import('canvas-confetti')).default;
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };
        const random = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);
            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    };

    const spinWheel = () => {
        if (isSpinning) return;
        setWonPrize(null);
        setIsSpinning(true);

        const randomIndex = Math.floor(Math.random() * prizes.length);
        const segmentSize = 360 / prizes.length;

        // Add extra spins (5-8 full rotations) + precision targeting
        const spinAmount = 2880 + (360 - (randomIndex * segmentSize)) - (segmentSize / 2);
        // Adding random jitter +/- within 40% of segment to feel organic but safe
        const jitter = (Math.random() - 0.5) * (segmentSize * 0.8);

        const newTotalRotation = rotation + spinAmount + jitter;

        // Ensure we always spin FORWARD and enough
        const finalRotation = Math.max(newTotalRotation, rotation + 1000);

        setRotation(finalRotation);

        setTimeout(() => {
            setIsSpinning(false);
            setWonPrize(prizes[randomIndex]);
            triggerConfetti();
        }, 5000);
    };

    return (
        <>
            {/* Trigger Section */}
            <section className="py-20 relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-br from-[#161b22] to-[#0d1117] p-1 rounded-3xl inline-block shadow-2xl box-glow border border-[#30363d] relative group"
                    >
                        <div className="absolute inset-0 bg-accent/5 blur-xl group-hover:bg-accent/10 transition-colors rounded-3xl"></div>
                        <div className="bg-[#161b22]/90 backdrop-blur-xl rounded-[22px] p-8 md:p-12 flex flex-col items-center relative z-10">
                            <div className="bg-accent/10 p-4 rounded-full mb-6">
                                <PartyPopper className="w-12 h-12 text-accent animate-bounce" />
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                                Birthday <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-400">Giveaway</span>
                            </h2>
                            <p className="text-gray-400 text-lg mb-8 max-w-lg font-mono">
                                Spin the wheel. Win premium dev resources. No catch.
                            </p>
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsOpen(true)}
                                className="bg-white text-black font-bold py-4 px-10 rounded-full text-xl flex items-center gap-2 hover:bg-accent transition-all shadow-lg hover:shadow-accent/50 group-hover:-translate-y-1"
                            >
                                Spin Now <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 50 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#0f1218] border border-[#30363d] rounded-3xl p-6 md:p-10 w-[95%] md:max-w-2xl w-full relative shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col items-center"
                        >
                            {/* Background Glow */}
                            <div className="absolute top-0 transform -translate-y-1/2 w-full h-64 bg-accent/20 blur-[100px] pointer-events-none"></div>

                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full z-30"
                            >
                                <X size={24} />
                            </button>

                            <h3 className="text-3xl font-bold text-center text-white mb-8 tracking-tight z-10">
                                Spin & <span className="text-accent">Win</span>
                            </h3>

                            <div className="relative w-72 h-72 md:w-80 md:h-80 mb-8 z-10">
                                {/* Pointer */}
                                <div className="absolute top-[-15px] left-1/2 -translate-x-1/2 z-30 filter drop-shadow-xl">
                                    <div className="w-8 h-10 bg-white clip-path-polygon-[50%_100%,0%_0%,100%_0%] shadow-lg"></div>
                                </div>

                                {/* Wheel Container with Border */}
                                <div className="relative w-full h-full p-2 rounded-full bg-gradient-to-b from-[#30363d] to-[#161b22] shadow-2xl">
                                    <motion.div
                                        className="w-full h-full rounded-full relative overflow-hidden shadow-inner"
                                        animate={{ rotate: rotation }}
                                        transition={{ duration: 5, type: "tween", ease: [0.13, 0.99, 0.29, 0.99] }} // Custom bezier for realistic spin
                                        style={{
                                            background: `conic-gradient(
                                                ${prizes.map((p, i) => `${p.color} ${i * (100 / prizes.length)}% ${(i + 1) * (100 / prizes.length)}%`).join(', ')}
                                            )`
                                        }}
                                    >
                                        {/* Segments Divider Lines & Icons */}
                                        {prizes.map((_, i) => (
                                            <div
                                                key={i}
                                                className="absolute w-full h-full top-0 left-0"
                                                style={{ transform: `rotate(${i * (360 / prizes.length)}deg)` }}
                                            >
                                                <div className="absolute top-0 left-1/2 w-[1px] h-1/2 bg-white/20 origin-bottom -translate-x-1/2"></div>
                                            </div>
                                        ))}

                                        {/* Inner Hub Shine */}
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none"></div>
                                    </motion.div>

                                    {/* Center Hub */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)] flex items-center justify-center z-20 border-4 border-[#161b22]">
                                        <Gift className="w-6 h-6 text-[#161b22]" />
                                    </div>
                                </div>
                            </div>

                            <div className="text-center h-24">
                                {wonPrize ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <p className="text-gray-400 text-sm mb-2">You won:</p>
                                        <h4 className="text-xl font-bold text-accent mb-4 flex items-center justify-center gap-2">
                                            {wonPrize.icon} {wonPrize.label}
                                        </h4>
                                        <a
                                            href={wonPrize.link}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-block bg-accent hover:bg-white text-black font-bold py-2 px-6 rounded-full text-sm transition-colors"
                                        >
                                            Claim Prize
                                        </a>
                                    </motion.div>
                                ) : (
                                    <button
                                        onClick={spinWheel}
                                        disabled={isSpinning}
                                        className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-xl border border-white/20 transition-all disabled:opacity-50"
                                    >
                                        {isSpinning ? 'Spinning...' : 'SPIN NOW!'}
                                    </button>
                                )}
                            </div>

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default SpinToWin;
