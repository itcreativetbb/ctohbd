import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import VelocityScroll from './VelocityScroll';
import { Trophy, Heart, Gift } from 'lucide-react';

const DonorTicker = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();

        // Subscribe to Winners
        const winnersSub = supabase
            .channel('public:spin_winners')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'spin_winners' }, (payload) => {
                addItem({ ...payload.new, type: 'win' });
            })
            .subscribe();

        // Subscribe to Gifts
        const giftsSub = supabase
            .channel('public:gifts')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'gifts' }, (payload) => {
                addItem({ ...payload.new, type: 'gift' });
            })
            .subscribe();

        return () => {
            supabase.removeChannel(winnersSub);
            supabase.removeChannel(giftsSub);
        };
    }, []);

    const addItem = (newItem) => {
        setItems(prev => [newItem, ...prev].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 30));
    };

    const fetchData = async () => {
        try {
            const [winnersRes, giftsRes] = await Promise.all([
                supabase.from('spin_winners').select('*').order('created_at', { ascending: false }).limit(20),
                supabase.from('gifts').select('*').order('created_at', { ascending: false }).limit(20)
            ]);

            const winners = (winnersRes.data || []).map(w => ({ ...w, type: 'win' }));
            const gifts = (giftsRes.data || []).map(g => ({ ...g, type: 'gift' }));

            const combined = [...winners, ...gifts].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setItems(combined);
        } catch (error) {
            console.error('Error fetching ticker data:', error);
            setItems([]);
        }
        setLoading(false);
    };

    if (loading || items.length === 0) {
        return (
            <div className="py-4 bg-[#0d1117] border-y border-[#30363d] overflow-hidden">
                <VelocityScroll
                    items={["Spin the Wheel! 🎁 Win Premium Prizes! 🚀 Support the Dev! ❤️"]}
                    defaultVelocity={50}
                    className="text-gray-500 text-xl font-mono px-4"
                />
            </div>
        );
    }

    // Creating Card Components
    const tickerCards = items.map((item, index) => {
        const isWin = item.type === 'win';
        return (
            <div key={`${item.type}-${item.id || index}`} className="flex items-center gap-3 bg-[#161b22] border border-[#30363d] rounded-full px-5 py-2 mx-3 shadow-sm whitespace-nowrap">
                <div className={`p-1.5 rounded-full ${isWin ? 'bg-purple-500/10 text-purple-400' : 'bg-pink-500/10 text-pink-400'}`}>
                    {isWin ? <Trophy size={14} /> : <Heart size={14} fill="currentColor" />}
                </div>
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm uppercase tracking-wide">
                            {isWin ? item.winner_name : item.donor_name}
                        </span>

                        <span className="text-gray-500 text-[10px] uppercase font-mono">
                            {isWin ? 'WON' : 'SENT'}
                        </span>

                        <span className={`font-mono text-xs px-1.5 py-0.5 rounded border ${isWin
                            ? 'text-purple-400 bg-purple-500/10 border-purple-500/20'
                            : 'text-pink-400 bg-pink-500/10 border-pink-500/20'}`}>
                            {isWin ? item.prize : `GH₵${item.amount}`}
                        </span>
                    </div>
                </div>
            </div>
        );
    });

    return (
        <div className="py-8 bg-[#0d1117] border-y border-[#30363d] overflow-hidden relative z-20">
            <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-[#0d1117] to-transparent z-10 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-[#0d1117] to-transparent z-10 pointer-events-none"></div>

            <VelocityScroll
                items={tickerCards}
                defaultVelocity={30} // Slower speed for readability
                className="inline-block"
            />
        </div>
    );
};

export default DonorTicker;
