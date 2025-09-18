// Fix: Add types for Vite's `import.meta.env` to make TypeScript aware of
// environment variables used for local development. This resolves multiple
// "Cannot find name" and "Property 'env' does not exist" errors in services/supabaseClient.ts.
interface ImportMetaEnv {
    // Fix: Corrected environment variable name to match usage in supabaseClient.ts
    readonly VITE_SUPABASE_URL?: string;
    readonly VITE_SUPABASE_ANON_KEY?: string;
    readonly DEV?: boolean;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}