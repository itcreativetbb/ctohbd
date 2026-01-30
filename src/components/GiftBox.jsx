import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, CreditCard, Copy, Check, Heart, Coffee, ExternalLink, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';
import { usePaystackPayment } from 'react-paystack';
import { supabase } from '../supabaseClient';

const giftOptions = [
    {
        id: 'coffee',
        label: 'Buy me a Coffee',
        amount: null,
        icon: <Coffee />,
        rewardLink: 'https://seed-tarsal-404.notion.site/CTO-BIRTHDAY-GIFT-2f86617b412480148348c61290f2c009'
    },
    {
        id: 'book',
        label: 'Tech Book Fund',
        amount: 10,
        icon: <Gift />,
        rewardLink: 'https://closed-hyacinth-b7f.notion.site/Platinum-Bundle-2-0-92c34bd92b2c48ceab940bace31a0f86'
    },
    {
        id: 'hardware',
        label: 'GPU Contribution',
        amount: 50,
        icon: <CreditCard />,
        rewardLink: '#' // TODO: Add specific link for Hardware
    },
    {
        id: 'custom',
        label: 'Custom Amount',
        amount: null,
        icon: <Heart />,
        rewardLink: '#' // TODO: Add specific link for Custom
    },
];

const GiftBox = () => {
    return <GiftBoxContent />;
};

const GiftBoxContent = () => {
    const [selectedGift, setSelectedGift] = useState(null);
    const [customAmount, setCustomAmount] = useState('');
    const [donorName, setDonorName] = useState('');
    const [isCopied, setIsCopied] = useState(false);
    const [loading, setLoading] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const amountVal = selectedGift?.amount || customAmount || 0;

    // Paystack Config
    const config = {
        reference: (new Date()).getTime().toString(),
        email: "donor@ctobirthday.com", // Placeholder
        amount: amountVal * 100, // GHS to Kobo
        publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '',
        currency: 'GHS',
        metadata: {
            donor_name: donorName,
            gift_reason: selectedGift?.label
        }
    };

    const initializePayment = usePaystackPayment(config);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const triggerConfetti = () => {
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const random = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    };

    const logGiftToSupabase = async () => {
        const giftItem = selectedGift?.label || 'Custom Gift';
        const { error } = await supabase
            .from('gifts')
            .insert([{
                item_name: giftItem,
                donor_name: donorName,
                amount: amountVal // Storing amount
            }]);
        if (error) console.error('Error logging gift:', error);
    };

    const onSuccess = () => {
        triggerConfetti();
        logGiftToSupabase();
        setLoading(false);
        setPaymentSuccess(true);
    };

    const onClose = () => {
        setLoading(false);
    };

    const handlePayClick = () => {
        if (!donorName.trim()) {
            alert("Please enter your name!");
            return;
        }
        if (!amountVal || amountVal <= 0) {
            alert("Please enter a valid amount!");
            return;
        }

        setLoading(true);
        initializePayment({ onSuccess, onClose });
    };

    const resetSelection = () => {
        setPaymentSuccess(false);
        setSelectedGift(null);
        setCustomAmount('');
        setDonorName('');
    }

    return (
        <section id="gifts" className="py-24 relative bg-[#0d1117]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

            <div className="max-w-4xl mx-auto px-4 relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-5xl font-bold font-sans text-center mb-16"
                    style={{ fontSize: "clamp(2rem, 6vw, 4rem)" }}
                >
                    <span className="border-b-4 border-accent pb-2">Support the Dev</span>
                </motion.h2>

                <AnimatePresence mode="wait">
                    {paymentSuccess ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-[#161b22]/80 backdrop-blur-md border border-green-500/50 rounded-2xl p-12 shadow-2xl text-center box-glow"
                        >
                            <PartyPopper className="w-24 h-24 text-accent mx-auto mb-6 animate-bounce" />
                            <h3 className="text-3xl font-bold text-white mb-4">Payment Successful! 🎉</h3>
                            <p className="text-gray-300 font-mono text-lg mb-8">
                                Thank you for your generous gift, <span className="text-accent font-bold">{donorName}</span>!
                                <br />Here's a special reward just for you.
                            </p>

                            <a
                                href={selectedGift?.rewardLink || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-accent hover:bg-white text-black font-bold py-4 px-8 rounded-xl text-xl uppercase tracking-wider transition-all transform hover:scale-105 shadow-lg shadow-accent/20 mb-6"
                            >
                                <span>Claim Your Reward</span>
                                <ExternalLink size={20} />
                            </a>

                            <br />
                            <button
                                onClick={resetSelection}
                                className="text-gray-500 hover:text-white underline font-mono text-sm mt-4"
                            >
                                Send another gift
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="input"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-[#161b22]/80 backdrop-blur-md border border-[#30363d] rounded-2xl p-8 shadow-2xl text-center box-glow"
                        >
                            <p className="text-gray-300 font-mono mb-8 text-lg">
                                If you'd like to fuel my next coding session or contribute to my hardware fund, select an option below!
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                {giftOptions.map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => setSelectedGift(option)}
                                        className={`p-4 rounded-xl border transition-all duration-300 flex flex-col items-center gap-3 relative overflow-hidden group ${selectedGift?.id === option.id
                                            ? 'bg-accent text-black border-accent scale-105 shadow-lg'
                                            : 'bg-[#0d1117] border-[#30363d] text-gray-400 hover:border-accent hover:text-white'
                                            }`}
                                    >
                                        <div className={`text-2xl ${selectedGift?.id === option.id ? 'text-black' : 'text-accent'}`}>{option.icon}</div>
                                        <span className="font-bold text-sm">{option.label}</span>
                                        {option.amount && <span className="text-xs font-mono opacity-80">GH₵{option.amount}</span>}
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-6 max-w-md mx-auto">
                                {(selectedGift?.id === 'custom' || selectedGift?.id === 'coffee') && (
                                    <input
                                        type="number"
                                        placeholder="Enter Amount (GH₵)"
                                        value={customAmount}
                                        onChange={(e) => setCustomAmount(e.target.value)}
                                        className="w-full bg-[#0d1117] border border-[#30363d] rounded p-3 text-white font-mono focus:border-accent focus:outline-none text-center"
                                    />
                                )}

                                <input
                                    type="text"
                                    placeholder="Your Name (for the records)"
                                    value={donorName}
                                    onChange={(e) => setDonorName(e.target.value)}
                                    className="w-full bg-[#0d1117] border border-[#30363d] rounded p-3 text-white font-mono focus:border-accent focus:outline-none text-center"
                                />

                                <button
                                    onClick={handlePayClick}
                                    disabled={!selectedGift || (!selectedGift.amount && !customAmount) || !donorName || loading}
                                    className="w-full bg-accent hover:bg-white text-black font-bold py-4 rounded-xl text-xl uppercase tracking-wider transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent/20"
                                >
                                    {loading ? "Processing..." : "Send Gift 🎁"}
                                </button>

                                <div className="flex flex-col items-center justify-center gap-2 text-sm text-gray-400 font-mono mt-4 bg-[#0d1117]/50 p-4 rounded border border-[#30363d]">
                                    <div className="flex items-center gap-2">
                                        <span>📲 Momo: <span className="text-accent font-bold">0557717398</span></span>
                                        <button
                                            onClick={() => handleCopy('0557717398')}
                                            className="hover:text-accent transition-colors"
                                            title="Copy Number"
                                        >
                                            {isCopied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                        </button>
                                    </div>
                                    <span className="font-bold text-white">BERNARD KPETSEY MAWULI 👤</span>
                                    <span className="text-xs text-gray-500">Ref: <span className="text-accent">Birthday Gift 🎂</span></span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default GiftBoxContent;
