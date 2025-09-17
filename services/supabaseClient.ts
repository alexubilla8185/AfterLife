import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const createMockSupabaseClient = (): SupabaseClient => {
    console.warn("Supabase URL or Anon Key not set in environment variables. Authentication features will be disabled.");
    
    return {
        auth: {
            getSession: async () => ({ data: { session: null }, error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
            signInWithOAuth: async () => {
                console.error("Authentication is not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.");
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
