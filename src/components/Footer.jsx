import React from 'react';
import { Github, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#0d1117] border-t border-[#30363d] py-12">
            <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
                <div className="text-center md:text-left">
                    <h3 className="font-bold text-xl text-white font-mono">Elorm Oscar</h3>
                    <p className="text-gray-500 text-sm mt-1">
                        Powered by <span className="text-accent">Coffee</span> & <span className="text-accent">Code</span> & <span className="text-accent">I.T CREATIVE TBB</span>
                    </p>
                </div>

                <div className="flex space-x-6">
                    <a href="https://github.com/ElormOscar" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                        <Github size={24} />
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                        <Linkedin size={24} />
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                        <Twitter size={24} />
                    </a>
                </div>

                <div className="text-gray-600 text-xs font-mono">
                    © 2026 Developer Birthday v3.0.0
                </div>
            </div>
        </footer>
    );
};

export default Footer;
