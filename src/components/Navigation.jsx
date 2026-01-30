import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Terminal, Home, User, Award, Gift, MessageSquare } from 'lucide-react';

const navItems = [
    { name: 'Timeline', href: '#timeline', icon: <Home size={20} /> },
    { name: 'Skills', href: '#skills', icon: <User size={20} /> },
    { name: 'Awards', href: '#awards', icon: <Award size={20} /> },
    { name: 'Guestbook', href: '#guestbook', icon: <MessageSquare size={20} /> },
    { name: 'Gifts', href: '#gifts', icon: <Gift size={20} /> },
];

const Navigation = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    const scrollToSection = (href) => {
        setIsOpen(false);
        const element = document.querySelector(href);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            {/* Desktop & Mobile Top Bar */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center backdrop-blur-md bg-[#0d1117]/70 border-b border-white/10">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <Terminal className="text-accent" />
                    <span className="font-mono font-bold text-lg hidden md:block">dev_birthday.exe</span>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex gap-8">
                    {navItems.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => scrollToSection(item.href)}
                            className="text-gray-300 hover:text-accent font-mono text-sm transition-colors relative group"
                        >
                            <span className="relative z-10">{item.name}</span>
                            <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
                        </button>
                    ))}
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden text-white hover:text-accent transition-colors" onClick={toggleMenu}>
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </nav>

            {/* Mobile Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-[73px] left-0 right-0 z-40 bg-[#0d1117]/95 backdrop-blur-xl border-b border-white/10 p-4 md:hidden shadow-2xl"
                    >
                        <div className="flex flex-col gap-4">
                            {navItems.map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => scrollToSection(item.href)}
                                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 text-gray-300 hover:text-accent transition-all"
                                >
                                    {item.icon}
                                    <span className="font-mono text-lg">{item.name}</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navigation;
