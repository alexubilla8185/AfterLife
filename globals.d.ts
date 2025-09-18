// Add types for Vite's `import.meta.env` to make TypeScript aware of
// environment variables used for local development.
interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL?: string;
    readonly VITE_SUPABASE_ANON_KEY?: string;
    readonly DEV?: boolean;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}