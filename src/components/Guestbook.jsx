import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Terminal, MessageSquare, Loader } from 'lucide-react';
import { supabase } from '../supabaseClient';

const Guestbook = () => {
    const [messages, setMessages] = useState([]);
    const [formData, setFormData] = useState({ name: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMessages();

        // Real-time subscription
        const subscription = supabase
            .channel('guestbook_channel')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'guestbook' }, payload => {
                setMessages((prevMessages) => [payload.new, ...prevMessages]);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    const fetchMessages = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('guestbook')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching messages:', error);
            // Don't show error UI for fetch failures to keep the vibe positive, just log it.
        } else {
            setMessages(data || []);
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!formData.name.trim() || !formData.message.trim()) {
            setError('Please fill in all fields.');
            setLoading(false);
            return;
        }

        const { error } = await supabase
            .from('guestbook')
            .insert([{
                name: formData.name,
                message: formData.message
            }]);

        if (error) {
            setError(`Failed to send message: ${error.message}`);
            console.error('Supabase Insert Error:', error);
        } else {
            setFormData({ name: '', message: '' });
        }
        setLoading(false);
    };

    return (
        <section id="guestbook" className="py-20 relative overflow-hidden">
            <div className="max-w-4xl mx-auto px-4 relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-5xl font-bold font-sans text-center mb-16"
                    style={{ fontSize: "clamp(2rem, 6vw, 4rem)" }}
                >
                    <span className="border-b-4 border-accent pb-2">Guestbook.log</span>
                </motion.h2>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Input Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-[#161b22]/80 backdrop-blur-md border border-[#30363d] p-6 rounded-xl shadow-2xl box-glow"
                    >
                        <div className="flex items-center gap-2 mb-6 border-b border-[#30363d] pb-4">
                            <Terminal className="text-accent w-5 h-5" />
                            <span className="font-mono text-sm text-gray-400">write_message.sh</span>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-mono text-gray-500 mb-1 uppercase">User Identity</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-[#0d1117] border border-[#30363d] rounded p-3 text-white font-mono focus:border-accent focus:outline-none transition-colors"
                                    placeholder="Enter your name..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-gray-500 mb-1 uppercase">Commit Message</label>
                                <textarea
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full bg-[#0d1117] border border-[#30363d] rounded p-3 text-white font-mono focus:border-accent focus:outline-none transition-colors h-32 resize-none"
                                    placeholder="Leave a birthday wish..."
                                />
                            </div>

                            {error && <p className="text-red-500 text-sm font-mono">{error}</p>}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-accent hover:bg-accent/90 text-black font-bold py-3 rounded flex items-center justify-center gap-2 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? <Loader className="animate-spin w-5 h-5" /> : <Send className="w-5 h-5" />}
                                <span className="font-mono">git push origin master</span>
                            </button>
                        </form>
                    </motion.div>

                    {/* Messages Display */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar"
                    >
                        <AnimatePresence>
                            {messages.length === 0 && !loading ? (
                                <div className="text-center text-gray-500 font-mono py-10">
                                    No logs found. Be the first to commit!
                                </div>
                            ) : (
                                messages.map((msg) => (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="bg-[#161b22]/60 backdrop-blur-sm border-l-4 border-accent p-4 rounded-r-lg hover:bg-[#161b22] transition-colors group"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-bold text-white font-mono flex items-center gap-2">
                                                <span className="text-accent">@</span>{msg.name}
                                            </span>
                                            <span className="text-xs text-gray-600 font-mono">
                                                {new Date(msg.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-gray-300 text-sm font-mono leading-relaxed">
                                            "{msg.message}"
                                        </p>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Guestbook;
