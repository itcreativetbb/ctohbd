import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Calendar, Briefcase, Code, Award, Zap } from 'lucide-react';

const milestones = [
    {
        year: '2026',
        title: 'Developer Birthday 3.0',
        description: 'Celebrating a new version release: v3.0.0. Optimized for performance and scalability.',
        icon: <Zap className="w-6 h-6" />
    },
    {
        year: '2024',
        title: 'Padocreative',
        description: 'Architectured and deployed a comprehensive platform for the community using modern stack.',
        icon: <Award className="w-6 h-6" />
    },
    {
        year: '2021',
        title: 'Founded I.T CREATIVE TBB',
        description: 'Established a creative tech agency to deliver high-quality digital solutions.',
        icon: <Briefcase className="w-6 h-6" />
    },
    {
        year: '2019',
        title: 'Hello World',
        description: 'Wrote the first line of code. It caused a syntax error, but the journey began.',
        icon: <Code className="w-6 h-6" />
    },
];

const Timeline = () => {
    return (
        <section id="timeline" className="py-20 overflow-hidden">
            <div className="max-w-5xl mx-auto px-4">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-5xl font-bold font-sans text-center mb-20"
                    style={{ fontSize: "clamp(2rem, 6vw, 4rem)" }}
                >
                    <span className="border-b-4 border-accent pb-2">Changelog & History</span>
                </motion.h2>

                <div className="relative border-l-4 border-white/10 ml-4 md:ml-[50%] space-y-16 md:space-y-24">
                    {milestones.map((item, index) => (
                        <TimelineItem key={index} item={item} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const TimelineItem = ({ item, index }) => {
    const isEven = index % 2 === 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, type: "spring" }}
            className={`relative pl-8 md:pl-0 flex flex-col md:flex-row items-center ${isEven ? 'md:flex-row-reverse' : ''} md:justify-between w-full`}
        >
            {/* Timeline Dot (Desktop Center) */}
            <div className="absolute left-[-14px] top-0 md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-10 bg-background border-4 border-accent rounded-full p-2 text-accent box-glow">
                {item.icon}
            </div>

            {/* Content Card */}
            <div className={`w-full md:w-[45%] bg-[#161b22]/70 backdrop-blur-md border border-[#30363d] p-6 rounded-xl hover:border-accent transition-all duration-300 box-glow-hover transform hover:-translate-y-2`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                    <h3 className="text-xl md:text-2xl font-bold text-white">{item.title}</h3>
                    <span className="text-accent font-mono font-bold bg-accent/10 px-3 py-1 rounded-full text-sm mt-2 md:mt-0 w-fit border border-accent/20">
                        {item.year}
                    </span>
                </div>
                <p className="text-gray-300 leading-relaxed font-mono text-sm md:text-base">
                    {item.description}
                </p>
            </div>

            {/* Spacer for the other side on desktop */}
            <div className="hidden md:block w-[45%]"></div>
        </motion.div>
    );
};

export default Timeline;
