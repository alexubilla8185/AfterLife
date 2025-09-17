import { createClient, SupabaseClient } from '@supabase/supabase-js';

// FIX: Switched from 'import.meta.env' to 'process.env' to access environment variables.
// This resolves the runtime error where 'import.meta.env' was undefined.
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const createMockSupabaseClient = (): SupabaseClient => {
    console.warn("VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not set in environment variables. Authentication features will be disabled.");
    
    return {
        auth: {
            getSession: async () => ({ data: { session: null }, error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
            signInWithOAuth: async () => {
                console.error("Authentication is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.");
                const error = { message: "Authentication is not configured.", name: "MissingEnvVars", status: 500 };
                return { data: {}, error };
            },
            signOut: async () => {
                return { error: null };
            },
        },
    } as unknown as SupabaseClient;
};

export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : createMockSupabaseClient();