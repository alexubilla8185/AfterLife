import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Use process.env, as it's supported by the build environment for client-side variable injection.
// The variable from the Netlify integration is VITE_SUPABASE_DATABASE_URL, which holds the project URL.
const supabaseUrl = process.env.VITE_SUPABASE_DATABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const createMockSupabaseClient = (): SupabaseClient => {
    console.warn("Supabase environment variables not set. Authentication features will be disabled.");
    
    return {
        auth: {
            getSession: async () => ({ data: { session: null }, error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
            signInWithOAuth: async () => {
                console.error("Authentication is not configured. Please set Supabase environment variables.");
                const error = { message: "Authentication is not configured.", name: "MissingEnvVars", status: 500 };
                return { data: {}, error };
            },
            signOut: async () => {
                return { error: null };
            },
        },
    } as unknown as SupabaseClient;
};

// Check for both variables to ensure proper initialization
export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : createMockSupabaseClient();
