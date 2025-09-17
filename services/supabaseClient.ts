import { createClient, SupabaseClient } from '@supabase/supabase-js';

// FIX: Reverted to process.env to match the user's build environment and resolve runtime errors.
const supabaseUrl = process.env.VITE_SUPABASE_DATABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const createMockSupabaseClient = (): SupabaseClient => {
    console.warn("Supabase environment variables not set. Authentication features will be disabled.");
    
    const authError = { message: "Authentication is not configured. Please set Supabase environment variables.", name: "MissingEnvVars", status: 500 };
    
    return {
        auth: {
            getSession: async () => ({ data: { session: null }, error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
            signInWithOAuth: async (options) => {
                console.error(`Mock signInWithOAuth for ${options?.provider} called. Authentication is not configured.`);
                return { data: {}, error: authError };
            },
            signInWithPassword: async () => {
                console.error("Mock signInWithPassword called. Authentication is not configured.");
                return { data: {}, error: authError };
            },
            signUp: async () => {
                 console.error("Mock signUp called. Authentication is not configured.");
                return { data: {}, error: authError };
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