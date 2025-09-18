declare global {
  interface ImportMeta {
    readonly env: {
      readonly VITE_SUPABASE_DATABASE_URL: string;
      readonly VITE_SUPABASE_ANON_KEY: string;
      readonly VITE_API_KEY: string;
    };
  }
}

// FIX: Add 'export {}' to make this file a module, which is required for 'declare global'.
export {};
