import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Send, MessageSquare } from 'lucide-react';

const Guestbook = () => {
    const [messages, setMessages] = useState([
        { name: 'FellowDev', message: 'Happy Birthday! May your code compile on the first try.' },
        { name: 'Recruiter', message: 'We are looking for a rockstar developer with 15 years in React...' },
        { name: 'StackOverflow', message: 'Closed as duplicate.' },
    ]);
    const [name, setName] = useState('');
    const [msg, setMsg] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name && msg) {
            setMessages([{ name, message: msg }, ...messages]);
            setName('');
            setMsg('');
        }
    };

    return (
        <section id="guestbook" className="py-20 bg-[#0d1117]/50">
            <div className="max-w-4xl mx-auto px-4">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-5xl font-bold font-sans text-center mb-12"
                >
                    <span className="border-b-4 border-accent pb-2">Sign the Log</span>
                </motion.h2>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Form Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-[#161b22] border border-[#30363d] p-6 rounded-lg shadow-xl"
                    >
                        <div className="flex items-center mb-6 space-x-2 text-gray-400 border-b border-[#30363d] pb-2">
                            <Terminal size={18} />
                            <span className="font-mono text-sm">guestbook.sh</span>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-accent font-mono text-sm mb-1">$ input --name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your Name (or GitHub Handle)"
                                    className="w-full bg-[#0d1117] border border-[#30363d] rounded p-3 text-white focus:border-accent focus:outline-none font-mono"
                                />
                            </div>
                            <div>
                                <label className="block text-accent font-mono text-sm mb-1">$ input --message</label>
                                <textarea
                                    value={msg}
                                    onChange={(e) => setMsg(e.target.value)}
                                    placeholder="Leave a birthday wish..."
                                    rows="4"
                                    className="w-full bg-[#0d1117] border border-[#30363d] rounded p-3 text-white focus:border-accent focus:outline-none font-mono"
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-accent text-[#0d1117] font-bold font-mono py-3 rounded hover:bg-accent/80 transition-colors flex items-center justify-center gap-2"
                            >
                                <Send size={18} />
                                <span>git commit -m "Happy Birthday!"</span>
                            </button>
                        </form>
                    </motion.div>

                    {/* Messages Display */}
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        {messages.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-[#161b22] border-l-4 border-accent p-4 rounded bg-opacity-50"
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-bold text-white font-mono text-sm">@{item.name}</span>
                                    <MessageSquare size={14} className="text-gray-500" />
                                </div>
                                <p className="text-gray-300 text-sm font-light italic">"{item.message}"</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Guestbook;
