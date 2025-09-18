// Add types for Vite's `import.meta.env` to make TypeScript aware of
// environment variables used for local development.
interface ImportMetaEnv {
    readonly VITE_SUPABASE_DATABASE_URL?: string;
    readonly VITE_SUPABASE_ANON_KEY?: string;
    readonly DEV?: boolean;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

// FIX: Add types for the Web Speech API to the global Window object.
// This resolves TypeScript errors for `window.SpeechRecognition` and `window.webkitSpeechRecognition`
// which are used in `components/VisitorView.tsx`.
interface Window {
  SpeechRecognition: any;
  webkitSpeechRecognition: any;
}
