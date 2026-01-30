import React from 'react';
import { motion } from 'framer-motion';
import { Award, Star, Trophy, Crown } from 'lucide-react';

const awards = [
    {
        title: "The Founder",
        icon: <Crown className="w-12 h-12" />,
        description: "Successfully established I.T CREATIVE TBB and delivered value to clients.",
        color: "border-lime-400"
    },
    {
        title: "Master Architect",
        icon: <Trophy className="w-12 h-12" />,
        description: "Designed scalable systems for Central Charis Chapel and other major projects.",
        color: "border-yellow-400"
    },
    {
        title: "Full-Stack Survivor",
        icon: <Award className="w-12 h-12" />,
        description: "Survived 1000+ merge conflicts and production deployments without downtime.",
        color: "border-purple-400"
    },
    {
        title: "Level 3.0 Unlocked",
        icon: <Star className="w-12 h-12" />,
        description: "Reached the 30th level of the game of life. Wisdom stats increased by +10.",
        color: "border-cyan-400"
    }
];

const HallOfFame = () => {
    return (
        <section id="awards" className="py-24 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent pointer-events-none"></div>
            <div className="max-w-7xl mx-auto px-4">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-5xl font-bold font-sans text-center mb-16"
                    style={{ fontSize: "clamp(2rem, 6vw, 4rem)" }}
                >
                    <span className="border-b-4 border-accent pb-2">Achievement Unlocked</span>
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {awards.map((award, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative bg-[#161b22]/70 backdrop-blur-md p-8 rounded-lg border-2 ${award.color} group hover:scale-105 transition-transform duration-300 shadow-xl`}
                        >
                            <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-lg"></div>

                            <div className="flex flex-col items-center text-center space-y-4 relative z-10">
                                <div className={`text-white p-4 rounded-full bg-white/5 group-hover:text-accent transition-colors duration-300 ${award.color.replace('border', 'text')} box-glow`}>
                                    {award.icon}
                                </div>
                                <h3 className="text-xl font-bold font-sans text-white">{award.title}</h3>
                                <p className="text-gray-400 text-sm font-mono leading-relaxed">
                                    {award.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HallOfFame;
