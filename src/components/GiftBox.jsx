import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, CreditCard, Copy, Check, Heart, Coffee } from 'lucide-react';
import confetti from 'canvas-confetti';
import { usePaystackPayment } from 'react-paystack';
import { supabase } from '../supabaseClient';

const giftOptions = [
    { id: 'coffee', label: 'Buy me a Coffee', amount: null, icon: <Coffee /> },
    { id: 'book', label: 'Tech Book Fund', amount: 25, icon: <Gift /> },
    { id: 'hardware', label: 'GPU Contribution', amount: 50, icon: <CreditCard /> },
    { id: 'custom', label: 'Custom Amount', amount: null, icon: <Heart /> },
];

const GiftBox = () => {
    const [selectedGift, setSelectedGift] = useState(null);
    const [customAmount, setCustomAmount] = useState('');
    const [donorName, setDonorName] = useState('');
    const [isCopied, setIsCopied] = useState(false);
    const [loading, setLoading] = useState(false);

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

    const logGiftToSupabase = async (reference) => {
        const giftItem = selectedGift?.label || 'Custom Gift';

        const { error } = await supabase
            .from('gifts')
            .insert([{
                item_name: giftItem,
                donor_name: donorName,
                // created_at is automatic
            }]);

        if (error) {
            console.error('Error logging gift:', error);
        } else {
            console.log("Gift logged successfully!");
        }
    };

    const onSuccess = (reference) => {
        triggerConfetti();
        logGiftToSupabase(reference);

        setSelectedGift(null);
        setCustomAmount('');
        setDonorName('');
        setLoading(false);
        alert("Thanks for the gift! Payment successful. 🎉");
    };

    const onClose = () => {
        setLoading(false);
        console.log('Payment closed');
    };

    const handleGift = () => {
        if (!donorName.trim()) {
            alert("Please enter your name!");
            return;
        }

        const amount = selectedGift?.amount || customAmount;
        if (!amount || isNaN(amount) || amount <= 0) {
            alert("Please enter a valid amount!");
            return;
        }

        setLoading(true);

        // Calculate amount in kobo (Paystack expects amount in smallest currency unit)
        // Assuming base currency is GHS
        const amountInKobo = amount * 100;

        const config = {
            reference: (new Date()).getTime().toString(),
            email: "user@example.com", // You might want to ask for this, or use a placeholder
            amount: amountInKobo,
            publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
            currency: 'GHS',
            metadata: {
                custom_fields: [
                    {
                        display_name: "Donor Name",
                        variable_name: "donor_name",
                        value: donorName
                    },
                    {
                        display_name: "Gift Type",
                        variable_name: "gift_type",
                        value: selectedGift?.label || "Custom"
                    }
                ]
            }
        };

        // We can't use the hook unconditionally in the onClick, 
        // but we can initialize the PaystackPop object directly if we didn't want the hook.
        // However, the hook returns `initializePayment`.
        // Let's rely on a separate component or just use the window.PaystackPop if available? 
        // Actually react-paystack provides a hook `usePaystackPayment` which is good.
        // But since we need dynamic config (amount changes), we should re-initialize or pass config to initializePayment.

        // Wait, usePaystackPayment takes config as argument. 
        // If config changes, we need to pass it to initializePayment? 
        // No, the hook takes config.

        // Better approach for dynamic amounts:
        // Use the library's direct function if possible, OR
        // Construct the component nicely.

        // Let's use a dynamic trigger. 
        // Since React hooks must be at top level, we can't call usePaystackPayment inside this function.
        // We can create a "PayButton" component or...
        // Actually, 'initializePayment' from the hook takes 'onSuccess' and 'onClose' callbacks.
        // DOES it take config overrides? usePaystackPayment(config).

        // Documentation says: const initializePayment = usePaystackPayment(config);
        // It seems config is fixed at hook time.

        // Workaround: We can't easily change hooks dynamically.
        // Alternative: Use the JS inline script method or 'react-paystack' has a simpler way?
        // Correct way with dynamic props in react-paystack:
        // You pass the config to `PaystackButton` OR
        // You use the hook with the CURRENT state.

        // Let's try to invoke the payment manually using the window object if react-paystack is too rigid for dynamic updates without re-rendering issues?
        // No, let's look at how to use the hook correctly.
        // If we call usePaystackPayment({ ...currentConfig }), it will recreate the initializePayment function when config changes.
        // So we can just call the hook at the top level with current state.

        // BUT, we only want to running the hook when the user clicks? 
        // No, the hook just prepares the function.

    };

    // Reworking strategy for Dynamic Hooks

    return (
        <GiftBoxContent />
    );
};

// Separating content to handle hooks cleaner if needed, or just doing it in one component.
// Let's stick to one component but define the hook with dynamic values.

const GiftBoxContent = () => {
    // ... state ...
    const [selectedGift, setSelectedGift] = useState(null);
    const [customAmount, setCustomAmount] = useState('');
    const [donorName, setDonorName] = useState('');
    const [isCopied, setIsCopied] = useState(false);
    const [loading, setLoading] = useState(false);

    const amountVal = selectedGift?.amount || customAmount || 0;

    // Paystack Config
    const config = {
        reference: (new Date()).getTime().toString(),
        email: "donor@ctobirthday.com", // Placeholder or ask user
        amount: amountVal * 100, // GHS to Kobo
        publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '',
        currency: 'GHS', // or NGN
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
            }]);
        if (error) console.error('Error logging gift:', error);
    };

    const onSuccess = () => {
        triggerConfetti();
        logGiftToSupabase();
        setSelectedGift(null);
        setCustomAmount('');
        setDonorName('');
        setLoading(false);
        // alert("Payment Successful!"); 
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
        // Trigger Paystack
        initializePayment({ onSuccess, onClose });
    };

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

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
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
            </div>
        </section>
    );
};

export default GiftBoxContent;
