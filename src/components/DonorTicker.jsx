import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import VelocityScroll from './VelocityScroll';
import { Heart, Ghost } from 'lucide-react';

const DonorTicker = () => {
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDonors();

        const subscription = supabase
            .channel('public:gifts')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'gifts' }, (payload) => {
                console.log('New gift received!', payload);
                setDonors(prev => [payload.new, ...prev]);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    const fetchDonors = async () => {
        const { data, error } = await supabase
            .from('gifts')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(20);

        if (error) {
            console.error('Error fetching donors:', error);
        } else {
            setDonors(data);
        }
        setLoading(false);
    };

    if (loading || donors.length === 0) {
        return (
            <div className="py-4 bg-[#0d1117] border-y border-[#30363d] overflow-hidden">
                <VelocityScroll
                    items={["Be the first to appear on the Wall of Fame! 🎁 Support the Dev! 🚀"]}
                    defaultVelocity={50}
                    className="text-gray-500 text-xl font-mono px-4"
                />
            </div>
        );
    }

    // Creating Card Components
    const donorCards = donors.map((d, index) => (
        <div key={d.id || index} className="flex items-center gap-3 bg-[#161b22] border border-[#30363d] rounded-full px-5 py-2 mx-3 shadow-sm whitespace-nowrap">
            <div className="bg-accent/10 p-1.5 rounded-full text-accent">
                {d.amount > 50 ? <Heart size={14} fill="currentColor" /> : <Heart size={14} />}
            </div>
            <div className="flex flex-col">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm uppercase tracking-wide">{d.donor_name}</span>
                    {d.amount && (
                        <span className="text-accent font-mono text-xs bg-accent/10 px-1.5 py-0.5 rounded">
                            GH₵{d.amount}
                        </span>
                    )}
                </div>
                <span className="text-[10px] text-gray-500 font-mono leading-tight">
                    this person also appreciated thanks to him
                </span>
            </div>
        </div>
    ));

    return (
        <div className="py-8 bg-[#0d1117] border-y border-[#30363d] overflow-hidden relative z-20">
            <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-[#0d1117] to-transparent z-10"></div>
            <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-[#0d1117] to-transparent z-10"></div>

            <VelocityScroll
                items={donorCards}
                defaultVelocity={30} // Slower speed for readability
                className="inline-block"
            />
        </div>
    );
};

export default DonorTicker;
