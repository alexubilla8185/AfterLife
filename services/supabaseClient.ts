import { createClient, SupabaseClient } from '@supabase/supabase-js';

// A non-functional "offline" client that prevents the app from crashing and logs warnings.
const createOfflineClient = (): SupabaseClient => {
    const offlineWarning = (method: string | symbol) => {
        console.warn(`[Offline Mode] Supabase call to '${String(method)}' was blocked.`);
    };

    const emptyPromise = (data: any = null) => Promise.resolve({
        data,
        error: { message: 'Application is in offline mode.', name: 'OfflineError' }
    });
    
    const fromHandler = {
        get(target: any, prop: string | symbol) {
            return () => {
                offlineWarning(`from(...).${String(prop)}`);
                return emptyPromise([]); // Return empty array for data
            }
        }
    };

    const storageFromHandler = {
        get(target: any, prop: string | symbol) {
            offlineWarning(`storage.from(...).${String(prop)}`);
            if (prop === 'getPublicUrl') {
                return () => ({ data: { publicUrl: '' } });
            }
            return () => emptyPromise();
        }
    };

    const offlineHandler = {
        get(target: any, prop: string | symbol) {
            if (prop === 'from') {
                return () => new Proxy({}, fromHandler);
            }
            if (prop === 'storage') {
                 return { from: () => new Proxy({}, storageFromHandler) };
            }
            if (prop === 'auth') {
                return {
                    getSession: () => {
                        offlineWarning('auth.getSession');
                        return Promise.resolve({ data: { session: null }, error: null });
                    },
                    onAuthStateChange: () => {
                        offlineWarning('auth.onAuthStateChange');
                        return { data: { subscription: { unsubscribe: () => {} } } };
                    },
                    signInWithOAuth: () => emptyPromise(),
                    signInWithPassword: () => emptyPromise(),
                    signUp: () => emptyPromise(),
                    signOut: () => Promise.resolve({ error: null }),
                }
            }
            // Catch-all for any other methods to prevent crashes
            return () => {
                offlineWarning(prop);
                return {};
            };
        },
    };

    return new Proxy({}, offlineHandler) as SupabaseClient;
};


let supabase: SupabaseClient;
let isInitialized = false;
let isOffline = false;

export const initializeSupabase = async (): Promise<void> => {
    // Prevent re-initialization
    if (isInitialized) return;

    try {
        const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY;

        if (supabaseUrl && supabaseAnonKey) {
            console.log("Initializing Supabase using direct environment variables.");
            supabase = createClient(supabaseUrl, supabaseAnonKey);
            isInitialized = true;
            return;
        }
    
        // Standard initialization via Netlify Function.
        console.log("Attempting to initialize Supabase from config function...");
        const functionsUrl = '/.netlify/functions/config';
        const response = await fetch(functionsUrl);

        if (!response.ok) {
            // For local development (not using `netlify dev`), this fetch will fail.
            // We can detect this and provide a helpful warning instead of a disruptive error.
            if (import.meta.env.DEV) {
                 console.warn("--- Supabase Initialization Info ---");
                 console.warn("Could not fetch config. This is expected if not running with 'netlify dev'.");
                 console.warn("Falling back to OFFLINE MODE. To connect locally, use 'netlify dev' or create a '.env' file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
                 console.warn("------------------------------------");
                 supabase = createOfflineClient();
                 isOffline = true;
                 isInitialized = true;
                 return;
            }
            // For production builds, a failed fetch is a real error.
            let errorMessage = `Failed to fetch Supabase configuration. Status: ${response.status}`;
            throw new Error(errorMessage);
        }

        const { supabaseUrl: fetchedUrl, supabaseAnonKey: fetchedKey } = await response.json();

        if (!fetchedUrl || !fetchedKey) {
            throw new Error('Supabase URL or Anon Key is missing in the server configuration.');
        }

        supabase = createClient(fetchedUrl, fetchedKey);
        console.log("Supabase initialized successfully from config function.");

    } catch (error: any) {
        console.error("--- Supabase Initialization Failed ---");
        console.error(`Error: ${error.message}`);
        console.warn("Application is now running in OFFLINE MODE. All backend features will be disabled.");
        console.error("--------------------------------------");
        supabase = createOfflineClient();
        isOffline = true;
    } finally {
        isInitialized = true;
    }
};

export const getSupabase = (): SupabaseClient => {
    if (!isInitialized) {
        // This should not happen if `initializeSupabase` is called correctly at app startup.
        // As a fallback, return the offline client to prevent a hard crash.
        console.error("getSupabase called before initialization. Falling back to offline mode.");
        return createOfflineClient();
    }
    return supabase;
};

export const isSupabaseOffline = (): boolean => {
    return isOffline;
};