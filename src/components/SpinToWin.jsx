import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, X, PartyPopper, ChevronRight, Palette, Code, Video, Download } from 'lucide-react';

const prizes = [
    { id: 1, label: 'Web Dev Courses', icon: <Code size={20} />, color: '#ff5f56', link: 'https://github.com/ElormOscar/My30thBirthday' }, // Placeholder links
    { id: 2, label: 'Design Assets', icon: <Palette size={20} />, color: '#ffbd2e', link: 'https://github.com/ElormOscar/My30thBirthday' },
    { id: 3, label: 'Video Editors', icon: <Video size={20} />, color: '#27c93f', link: 'https://github.com/ElormOscar/My30thBirthday' },
    { id: 4, label: 'Free Tools', icon: <Download size={20} />, color: '#00a8ff', link: 'https://github.com/ElormOscar/My30thBirthday' },
    { id: 5, label: 'Premium Kits', icon: <Gift size={20} />, color: '#9c27b0', link: 'https://github.com/ElormOscar/My30thBirthday' },
    { id: 6, label: 'Surprise Gift', icon: <PartyPopper size={20} />, color: '#e91e63', link: 'https://github.com/ElormOscar/My30thBirthday' },
];

const SpinToWin = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [wonPrize, setWonPrize] = useState(null);

    const triggerConfetti = async () => {
        const confetti = (await import('canvas-confetti')).default;
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            zIndex: 9999
        });
    };

    const handleSpin = () => {
        if (isSpinning || wonPrize) return;

        setIsSpinning(true);
        const newRotation = rotation + 1800 + Math.random() * 360; // At least 5 spins
        setRotation(newRotation);

        setTimeout(() => {
            setIsSpinning(false);
            // Calculate prize based on rotation
            const normalizedRotation = newRotation % 360;
            const segmentAngle = 360 / prizes.length;
            // The pointer is usually at the top (0 degrees) or right.
            // Assuming pointer at top (0), and wheel rotates clockwise.
            // The segment AT the pointer is what matters. 
            // If rotation is 0, segment 1 is at top (if mapped that way).
            // Let's simplify: random winning index first, then rotate TO it.

        }, 5000); // 5s spin duration matching CSS/transition
    };

    // Better Logic: Decide winner first, then calculate rotation
    const spinWheel = () => {
        if (isSpinning) return;
        setWonPrize(null);
        setIsSpinning(true);

        const randomIndex = Math.floor(Math.random() * prizes.length);
        const prize = prizes[randomIndex];

        // Calculate angle to land on this prize
        // 360 / length = segment size. 
        // We want the prize to be at the TOP (270deg or -90deg usually in CSS, but let's say pointer is at Top).
        // Each segment is index * 60deg. 
        // We need 360 - (index * 60) + 360 * 5 (spins).
        // Adding random jitter within the segment.

        const segmentSize = 360 / prizes.length;
        const targetAngle = 360 - (randomIndex * segmentSize);
        const spins = 360 * 8; // 8 full spins
        const finalRotation = rotation + spins + targetAngle + (segmentSize / 2); // Center of segment
        // Need to account for previous rotation to keep it continuous? 
        // Actually, simple addition works.

        setRotation(Math.ceil(finalRotation / 360) * 360 - (randomIndex * segmentSize) + 360 * 5);

        // Let's retry simple math:
        // We want to land on 'prize'.
        // Current rotation % 360 is where we are.
        // We want to add enough rotation to reach target.

        // Simplified Visual Approach:
        // Random massive rotation.
        // Calculate winner based on final angle.

        const spinAmount = 1800 + Math.random() * 360;
        const newTotalRotation = rotation + spinAmount;
        setRotation(newTotalRotation);

        setTimeout(() => {
            setIsSpinning(false);
            const actualAngle = newTotalRotation % 360;
            // Determine segment.
            // 0-60: Prize ?
            // Let's assume uniform distribution.
            // If 0 is Top.
            // Since we rotate container, the items rotate.
            // We need to map angel to item.
            // Instead of mathing it perfectly, let's just pick one for now 
            // or use the pre-calculated logic. I'll stick to visual random provided by CSS and calc result.

            // Reversed calculation:
            // 360 - actualAngle gives the position relative to 0.
            // (360 - actualAngle + offset) / segmentSize

            const segment = Math.floor(((360 - (actualAngle % 360)) % 360) / (360 / prizes.length));
            setWonPrize(prizes[segment]);
            triggerConfetti();
        }, 4000);
    };

    return (
        <>
            {/* Trigger Section */}
            <section className="py-20 relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="bg-gradient-to-r from-purple-600 via-pink-600 to-accent p-1 rounded-2xl inline-block shadow-2xl box-glow"
                    >
                        <div className="bg-[#161b22] rounded-xl p-8 md:p-12 flex flex-col items-center">
                            <PartyPopper className="w-16 h-16 text-yellow-400 mb-6 animate-bounce" />
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Birthday Giveaway!</h2>
                            <p className="text-gray-300 text-lg mb-8 max-w-lg">
                                Feeling lucky? Spin the wheel to win exclusive developer resources, premium assets, and more!
                            </p>
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsOpen(true)}
                                className="bg-accent text-black font-bold py-3 px-8 rounded-full text-xl flex items-center gap-2 hover:bg-white transition-colors cursor-pointer"
                            >
                                Spin to Win <ChevronRight />
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
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 max-w-md w-full relative shadow-2xl overflow-hidden"
                        >
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                            >
                                <X />
                            </button>

                            <h3 className="text-2xl font-bold text-center text-white mb-8">Spin & Win! 🎁</h3>

                            <div className="relative w-64 h-64 mx-auto mb-8">
                                {/* Pointer */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-20 w-8 h-8 text-accent">
                                    <div className="w-0 h-0 border-l-[10px] border-l-transparent border-t-[20px] border-t-accent border-r-[10px] border-r-transparent"></div>
                                </div>

                                {/* Wheel */}
                                <motion.div
                                    className="w-full h-full rounded-full border-4 border-[#30363d] relative overflow-hidden transition-transform ease-out"
                                    animate={{ rotate: rotation }}
                                    transition={{ duration: 4, type: "tween", ease: "circOut" }}
                                    style={{
                                        background: `conic-gradient(
                                            ${prizes.map((p, i) => `${p.color} ${i * (100 / prizes.length)}% ${(i + 1) * (100 / prizes.length)}%`).join(', ')}
                                        )`
                                    }}
                                >
                                    {/* Lines dividing segments (optional/styled) */}
                                </motion.div>
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
