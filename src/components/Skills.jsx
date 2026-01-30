import React from 'react';
import { motion } from 'framer-motion';
import {
    Code, Database, Layout, Server, Terminal, Figma,
    GitBranch, Globe, Cpu, Layers, Box, Coffee
} from 'lucide-react';

const skills = [
    { name: 'React.js', category: 'Frontend', icon: <Code />, level: 'Expert' },
    { name: 'Next.js', category: 'Frontend', icon: <Cpu />, level: 'Expert' },
    { name: 'Tailwind CSS', category: 'Frontend', icon: <Layout />, level: 'Expert' },
    { name: 'Node.js', category: 'Backend', icon: <Server />, level: 'Advanced' },
    { name: 'PostgreSQL', category: 'Backend', icon: <Database />, level: 'Advanced' },
    { name: 'TypeScript', category: 'Language', icon: <Terminal />, level: 'Advanced' },
    { name: 'Figma', category: 'Design', icon: <Figma />, level: 'Intermediate' },
    { name: 'Git & GitHub', category: 'Tools', icon: <GitBranch />, level: 'Expert' },
    { name: 'Docker', category: 'DevOps', icon: <Box />, level: 'Intermediate' },
    { name: 'WebSockets', category: 'Backend', icon: <Globe />, level: 'Intermediate' },
    { name: 'System Design', category: 'Architecture', icon: <Layers />, level: 'Advanced' },
    { name: 'Caffeine', category: 'Fuel', icon: <Coffee />, level: 'Infinity' },
];

const Skills = () => {
    return (
        <section id="skills" className="py-20 bg-[#0d1117]/50 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

            <div className="max-w-6xl mx-auto px-4 relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-5xl font-bold font-sans text-center mb-16"
                    style={{ fontSize: "clamp(2rem, 6vw, 4rem)" }}
                >
                    <span className="border-b-4 border-accent pb-2">Tech Stack & Dependencies</span>
                </motion.h2>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {skills.map((skill, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-[#161b22]/60 backdrop-blur-sm border border-[#30363d] p-4 rounded-xl flex flex-col items-center justify-center gap-3 text-center group hover:border-accent transition-all duration-300 box-glow-hover cursor-pointer"
                        >
                            <div className="text-gray-400 group-hover:text-accent transition-colors duration-300 transform scale-125">
                                {skill.icon}
                            </div>
                            <h3 className="font-bold text-white group-hover:text-accent transition-colors text-sm md:text-base">{skill.name}</h3>
                            <div className="text-xs text-gray-500 font-mono bg-[#0d1117]/80 px-2 py-1 rounded border border-[#30363d] group-hover:border-accent/30 transition-colors">
                                v{skill.level}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skills;
