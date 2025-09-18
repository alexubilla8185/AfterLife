import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './hooks/useTheme';
import { UserProvider } from './hooks/useUser';
import { initializeSupabase, isSupabaseOffline } from './services/supabaseClient';

const AppInitializer: React.FC = () => {
    const [initialized, setInitialized] = useState(false);
    const [isOffline, setIsOffline] = useState(false);

    useEffect(() => {
        const init = async () => {
            await initializeSupabase();
            setIsOffline(isSupabaseOffline());
            setInitialized(true);
        };
        init();
    }, []);
    
    if (!initialized) {
        return (
             <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <p className="text-gray-500 dark:text-gray-400 text-lg">Initializing...</p>
            </div>
        );
    }

    return (
        <ThemeProvider>
            <UserProvider>
                <App isOffline={isOffline} />
            </UserProvider>
        </ThemeProvider>
    );
};


const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AppInitializer />
  </React.StrictMode>
);
