import React from 'react';
import { motion } from 'framer-motion';
import { Gift, CreditCard, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

const GiftBox = () => {
    const triggerConfetti = () => {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const random = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    };

    const handleDonation = () => {
        triggerConfetti();
        // Redirect logic would go here
        window.open('https://paystack.com', '_blank'); // Example link
    };

    return (
        <section id="gifts" className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-accent/5 skew-y-3 transform origin-bottom-right"></div>
            <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    className="bg-[#161b22] border-2 border-dashed border-accent/50 rounded-2xl p-10 md:p-16 flex flex-col items-center justify-center space-y-8 box-glow"
                >
                    <div className="bg-accent/10 p-6 rounded-full text-accent mb-4 animate-bounce">
                        <Gift size={64} />
                    </div>

                    <h2 className="text-3xl md:text-5xl font-bold font-sans text-white">
                        Fuel the Developer
                    </h2>
                    <p className="text-gray-400 max-w-lg text-lg">
                        Coding requires caffeine and snacks. Support the birthday fund or contribute to my wishlist dependencies.
                    </p>

                    <div className="flex flex-col md:flex-row gap-6 w-full justify-center">
                        <button
                            onClick={handleDonation}
                            className="bg-accent text-black font-bold py-4 px-8 rounded-full text-lg hover:shadow-[0_0_20px_rgba(57,255,20,0.5)] transition-shadow duration-300 flex items-center justify-center gap-3"
                        >
                            <CreditCard />
                            <span>npm install --save gift-for-dev</span>
                        </button>
                    </div>

                    <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4 text-left w-full max-w-lg">
                        {['Keyboard ^v2.0', 'UdemyCourse ^vNext', 'CoffeeSubscription @latest'].map((item, i) => (
                            <div key={i} className="bg-[#0d1117] border border-[#30363d] p-3 rounded text-xs font-mono text-gray-500">
                                dependencies: <span className="text-accent">{item}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default GiftBox;
