import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, X, PartyPopper, ChevronRight, Palette, Code, Video, Download, Terminal, Zap, Briefcase, Sparkles } from 'lucide-react';

const prizes = [
    { id: 1, label: 'Mentorship', icon: <Video size={14} />, color: '#7c3aed', textColor: '#ffffff', link: 'https://cal.com/elormoscar' }, // Violet
    { id: 2, label: 'Course', icon: <Code size={14} />, color: '#2563eb', textColor: '#ffffff', link: '#' }, // Blue
    { id: 3, label: 'UI Kit', icon: <Palette size={14} />, color: '#db2777', textColor: '#ffffff', link: '#' }, // Pink
    { id: 4, label: 'Review', icon: <Terminal size={14} />, color: '#059669', textColor: '#ffffff', link: '#' }, // Emerald
    { id: 5, label: 'Cloud $', icon: <Zap size={14} />, color: '#ca8a04', textColor: '#ffffff', link: '#' }, // Yellow/Gold
    { id: 6, label: 'Audit', icon: <Briefcase size={14} />, color: '#4f46e5', textColor: '#ffffff', link: '#' }, // Indigo
    { id: 7, label: 'Tools', icon: <Download size={14} />, color: '#0891b2', textColor: '#ffffff', link: '#' }, // Cyan
    { id: 8, label: 'Mystery', icon: <Sparkles size={14} />, color: '#dc2626', textColor: '#ffffff', link: '#' }, // Red
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
                            className="bg-gradient-to-b from-[#1c2128] to-[#161b22] border-2 border-white/10 rounded-3xl p-6 md:p-10 w-[95%] md:max-w-xl w-full relative shadow-[0_0_60px_rgba(124,58,237,0.15)] overflow-y-auto max-h-[90vh] flex flex-col items-center custom-scrollbar"
                        >
                            {/* Background Glow */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-[400px] bg-accent/5 blur-[120px] pointer-events-none rounded-full"></div>

                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full z-30"
                            >
                                <X size={24} />
                            </button>

                            <h3 className="text-3xl font-bold text-center text-white mb-8 tracking-tight z-10">
                                Spin & <span className="text-accent">Win</span>
                            </h3>

                            <div className="relative w-72 h-72 md:w-80 md:h-80 mb-8 z-10 shrink-0">
                                {/* Pointer */}
                                <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 z-30 filter drop-shadow-xl">
                                    <div
                                        className="w-10 h-12 bg-gradient-to-b from-white to-gray-200"
                                        style={{ clipPath: 'polygon(50% 100%, 0% 0%, 100% 0%)' }}
                                    ></div>
                                </div>

                                {/* Wheel Container with Border */}
                                <div className="relative w-full h-full p-3 rounded-full bg-gradient-to-b from-[#4a5568] to-[#1a202c] shadow-[0_0_30px_rgba(0,0,0,0.8)] border-4 border-[#2d3748]">
                                    <motion.div
                                        className="w-full h-full rounded-full relative overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"
                                        animate={{ rotate: rotation }}
                                        transition={{ duration: 5, type: "tween", ease: [0.13, 0.99, 0.29, 0.99] }} // Custom bezier for realistic spin
                                        style={{
                                            background: `conic-gradient(
                                                ${prizes.map((p, i) => `${p.color} ${i * (100 / prizes.length)}% ${(i + 1) * (100 / prizes.length)}%`).join(', ')}
                                            )`
                                        }}
                                    >
                                        {/* Segments Text & Icons */}
                                        {prizes.map((prize, i) => {
                                            const rotation = (360 / prizes.length) * i + (360 / prizes.length) / 2;
                                            return (
                                                <div
                                                    key={prize.id}
                                                    className="absolute w-full h-full top-0 left-0 flex justify-center pt-2"
                                                    style={{
                                                        transform: `rotate(${rotation}deg)`,
                                                    }}
                                                >
                                                    <div className="flex flex-col items-center gap-2" style={{ color: prize.textColor }}>
                                                        <span className="bg-black/20 p-1.5 rounded-full backdrop-blur-sm shadow-sm">{prize.icon}</span>
                                                        <span
                                                            className="font-bold text-[10px] md:text-xs uppercase tracking-wider drop-shadow-md"
                                                            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                                                        >
                                                            {prize.label}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {/* Inner Hub Shine (Overlay) */}
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
