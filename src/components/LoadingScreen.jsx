import React from 'react';
import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';

const LoadingScreen = () => {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 bg-[#0d1117] flex items-center justify-center"
        >
            <div className="text-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="inline-block mb-4"
                >
                    <Terminal className="w-12 h-12 text-accent" />
                </motion.div>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    className="h-1 bg-accent rounded-full max-w-[200px] mx-auto overflow-hidden"
                >
                    <div className="h-full w-full bg-white/20"></div>
                </motion.div>
                <p className="mt-4 text-gray-500 font-mono text-sm animate-pulse">Initializing v3.0.0...</p>
            </div>
        </motion.div>
    );
};

export default LoadingScreen;
