import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import VelocityScroll from './VelocityScroll';

const DonorTicker = () => {
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDonors();

        // Real-time subscription
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
        // Show placeholder or nothing if no donors yet
        return (
            <div className="py-4 bg-[#0d1117] border-t border-[#30363d] overflow-hidden">
                <VelocityScroll
                    texts={["Be the first to appear on the Wall of Fame! 🎁 Support the Dev! 🚀"]}
                    velocity={50}
                    className="text-gray-500 text-xl md:text-2xl font-mono"
                />
            </div>
        );
    }

    // Format strings: "NAME ($AMOUNT) - MESSAGE"
    const tickerItems = donors.map(d => {
        const amountDisplay = d.amount ? `$${d.amount}` : '';
        // Note: We need to ensure we save amount in DB for this to work perfectly.
        // Fallback message if not provided
        const message = "this person also appreciated thanks to him";

        return `${d.donor_name.toUpperCase()} ${amountDisplay} - ${message}   ✦  `;
    });

    // We can join them into one long string or have multiple items.
    // VelocityScroll accepts an array of strings (rows). 
    // Let's create one long row or two rows if we have many.
    const combinedText = tickerItems.join(" ");

    return (
        <div className="py-8 bg-[#0d1117] border-y border-[#30363d] overflow-hidden relative z-20">
            <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-[#0d1117] to-transparent z-10"></div>
            <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-[#0d1117] to-transparent z-10"></div>

            <VelocityScroll
                texts={[combinedText]}
                velocity={80}
                className="text-accent text-2xl md:text-4xl font-mono font-bold"
            />
        </div>
    );
};

export default DonorTicker;
