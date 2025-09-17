import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './hooks/useTheme';
import { UserProvider } from './hooks/useUser';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <UserProvider>
        {/* FIX: Removed redundant MemorialProfileProvider. This is now handled inside App.tsx to ensure the correct memorialId is available, resolving a missing prop error. */}
        <App />
      </UserProvider>
    </ThemeProvider>
  </React.StrictMode>
);
