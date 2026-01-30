import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import VelocityScroll from './VelocityScroll';
import { Trophy, Gift } from 'lucide-react';

const DonorTicker = () => {
    const [winners, setWinners] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWinners();

        const subscription = supabase
            .channel('public:spin_winners')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'spin_winners' }, (payload) => {
                console.log('New winner!', payload);
                setWinners(prev => [payload.new, ...prev]);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    const fetchWinners = async () => {
        const { data, error } = await supabase
            .from('spin_winners')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(20);

        if (error) {
            console.error('Error fetching winners:', error);
            setWinners([]); // Ensure array on error
        } else {
            setWinners(data || []); // Ensure array if data is null
        }
        setLoading(false);
    };

    if (loading || winners.length === 0) {
        return (
            <div className="py-4 bg-[#0d1117] border-y border-[#30363d] overflow-hidden">
                <VelocityScroll
                    items={["Spin the Wheel! 🎁 Win Premium Prizes! 🚀"]}
                    defaultVelocity={50}
                    className="text-gray-500 text-xl font-mono px-4"
                />
            </div>
        );
    }

    // Creating Card Components
    const winnerCards = winners.map((w, index) => (
        <div key={w.id || index} className="flex items-center gap-3 bg-[#161b22] border border-[#30363d] rounded-full px-5 py-2 mx-3 shadow-sm whitespace-nowrap">
            <div className="bg-accent/10 p-1.5 rounded-full text-accent">
                <Trophy size={14} />
            </div>
            <div className="flex flex-col">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm uppercase tracking-wide">{w.winner_name}</span>
                    <span className="text-gray-400 text-xs">won</span>
                    <span className="text-accent font-mono text-xs bg-accent/10 px-1.5 py-0.5 rounded border border-accent/20">
                        {w.prize}
                    </span>
                </div>
            </div>
        </div>
    ));

    return (
        <div className="py-8 bg-[#0d1117] border-y border-[#30363d] overflow-hidden relative z-20">
            <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-[#0d1117] to-transparent z-10 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-[#0d1117] to-transparent z-10 pointer-events-none"></div>

            <VelocityScroll
                items={winnerCards}
                defaultVelocity={30} // Slower speed for readability
                className="inline-block"
            />
        </div>
    );
};

export default DonorTicker;
