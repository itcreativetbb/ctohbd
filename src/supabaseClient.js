import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fail gracefully if keys are missing to prevent white screen of death
let supabaseClient;

if (supabaseUrl && supabaseAnonKey) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
} else {
    console.error('Supabase keys missing. Using mock client.');
    // Mock client to prevent crashes in dependent components
    supabaseClient = {
        from: () => ({
            select: () => ({ order: () => ({ limit: () => ({ data: [], error: null }) }) }),
            insert: () => ({ error: null }),
        }),
        channel: () => ({
            on: () => ({ subscribe: () => { } }),
            subscribe: () => { },
            unsubscribe: () => { },
        }),
        removeChannel: () => { },
    };
}

export const supabase = supabaseClient;
