import React, { useState, useRef, useEffect } from 'react';
import CreatorDashboard from './components/CreatorDashboard';
import VisitorView from './components/VisitorView';
import Login from './components/Login';
import Onboarding from './components/Onboarding';
import ThemeMenu from './components/ThemeMenu';
import { MemorialProfileProvider } from './hooks/useMemorialProfile';
import LandingPage from './components/LandingPage';
import ProfilePage from './components/ProfilePage';
import { useUser } from './hooks/useUser';
import { getSupabase } from './services/supabaseClient';
import AdminPage from './components/AdminPage';
import PrivacyPolicy from './components/PrivacyPolicy';
import DataDeletion from './components/DataDeletion';
import HowItWorksPage from './components/HowItWorksPage';
import Tooltip from './components/ui/Tooltip';
import { useTheme } from './hooks/useTheme';
import { motion, AnimatePresence } from 'framer-motion';

export type View = 'landing' | 'login' | 'creator' | 'visitor' | 'profile' | 'admin' | 'privacy' | 'data-deletion' | 'how-it-works' | 'demoVisitor';

interface AppProps {
  isOffline: boolean;
}

const SunIcon = () => (
  <motion.svg
    key="sun"
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    initial={{ scale: 0.5, opacity: 0, rotate: -90 }}
    animate={{ scale: 1, opacity: 1, rotate: 0 }}
    exit={{ scale: 0.5, opacity: 0, rotate: 90 }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </motion.svg>
);

const MoonIcon = () => (
  <motion.svg
    key="moon"
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    initial={{ scale: 0.5, opacity: 0, rotate: 90 }}
    animate={{ scale: 1, opacity: 1, rotate: 0 }}
    exit={{ scale: 0.5, opacity: 0, rotate: -90 }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </motion.svg>
);


const App: React.FC<AppProps> = ({ isOffline }) => {
  const { user } = useUser();
  const { theme } = useTheme();
  const [view, setView] = useState<View>('landing');
  const [activeMemorialId, setActiveMemorialId] = useState<string | null>(null);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
    
  const themeMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onboardingComplete = localStorage.getItem('onboardingComplete');
    // Only show onboarding if it's not complete AND the user is entering a main app view.
    if (!onboardingComplete && (view === 'profile' || view === 'demoVisitor')) {
      setShowOnboarding(true);
    }
  }, [view]);

  const handleOnboardingFinish = () => {
    localStorage.setItem('onboardingComplete', 'true');
    setShowOnboarding(false);
  };

  useEffect(() => {
    const supabase = getSupabase();
    const checkAndSetInitialMemorial = async () => {
        if (!user) return;
        
        const { data, error } = await supabase.from('memorials').select('id').eq('user_id', user.id).limit(1);

        if (error) { 
            console.error("Error checking for memorials:", error); 
            return; 
        }

        if (data && data.length > 0) {
            setActiveMemorialId(data[0].id);
        }
        // If no memorials, the profile page will show an empty state.
    };
    
    if (user && (view === 'login' || view === 'landing')) {
        setView('profile');
        checkAndSetInitialMemorial();
    }
    if (!user && view !== 'landing' && !['how-it-works', 'privacy', 'data-deletion', 'demoVisitor'].includes(view)) {
        setView('login');
        setActiveMemorialId(null);
    }
  }, [user, view]);

  const handleNavigate = (newView: 'creator' | 'visitor', memorialId: string) => {
    setActiveMemorialId(memorialId);
    setView(newView);
  };
  
  const handleSwitchRole = () => {
    setView(prevView => {
      if (prevView === 'profile' || prevView === 'admin') {
        if(activeMemorialId) return 'visitor';
        return prevView;
      }
      return prevView === 'creator' ? 'visitor' : 'creator';
    });
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setIsThemeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const renderView = () => {
    switch (view) {
      case 'landing':
        return <LandingPage onNavigate={setView} />;
      case 'login':
        return <Login />;
      case 'profile':
        return <ProfilePage onNavigate={handleNavigate} />;
      case 'admin':
        return <AdminPage />;
      case 'creator':
        return <CreatorDashboard />;
      case 'visitor':
        return <VisitorView />;
      case 'demoVisitor':
        return (
          <MemorialProfileProvider memorialId="demo">
            <VisitorView />
          </MemorialProfileProvider>
        );
      case 'how-it-works':
        return <HowItWorksPage onNavigate={setView} />;
      case 'privacy':
        return <PrivacyPolicy onNavigate={setView} />;
      case 'data-deletion':
        return <DataDeletion onNavigate={setView} />;
      default:
        return <LandingPage onNavigate={setView} />;
    }
  };

  const showHeader = !['landing', 'login', 'how-it-works', 'privacy', 'data-deletion'].includes(view);
  const showProfileProvider = view === 'creator' || view === 'visitor';

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-container transition-colors duration-300">
      {showOnboarding && <Onboarding onClose={handleOnboardingFinish} />}

      {isOffline && (
          <div className="bg-yellow-400 dark:bg-yellow-600 text-yellow-900 dark:text-yellow-100 text-center p-2 text-sm font-semibold sticky top-0 z-50">
            Offline Mode: Backend features are disabled.
          </div>
        )}
      
      {showHeader && (
        <header className="sticky top-0 z-40 bg-surface/80 dark:bg-surface-container/80 backdrop-blur-lg border-b border-outline">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <button
                onClick={() => setView('landing')}
                aria-label="Back to home"
                className="flex items-center space-x-4 group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface rounded-lg"
              >
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-8 w-8 text-primary transition-transform group-hover:scale-110">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
                <div className="flex items-baseline space-x-2">
                  <h1 className="text-xl font-bold text-on-surface transition-colors group-hover:text-primary">AfterLife</h1>
                </div>
              </button>

              <div className="flex items-center space-x-2 sm:space-x-4">
                 {view === 'demoVisitor' ? (
                     <button 
                        onClick={() => setView('landing')} 
                        className="inline-flex items-center justify-center p-2 sm:px-4 sm:py-2 bg-secondary-container text-on-secondary-container text-sm font-medium rounded-full hover:bg-opacity-80 transition-colors"
                        aria-label="Back to Home"
                    >
                        Back to Home
                    </button>
                 ) : (
                    <>
                        {view !== 'profile' && user && (
                            <Tooltip content="My Profile">
                                <button 
                                    onClick={() => setView('profile')} 
                                    className="inline-flex items-center justify-center p-2 sm:px-4 sm:py-2 bg-secondary-container text-on-secondary-container text-sm font-medium rounded-full hover:bg-opacity-80 transition-colors"
                                    aria-label="My Profile"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    <span className="hidden sm:inline sm:ml-2">My Profile</span>
                                </button>
                            </Tooltip>
                        )}
                        {user?.role === 'admin' && view !== 'admin' && (
                            <Tooltip content="Admin Dashboard">
                                <button 
                                    onClick={() => setView('admin')} 
                                    className="inline-flex items-center justify-center p-2 sm:px-4 sm:py-2 bg-tertiary-container text-on-tertiary-container text-sm font-medium rounded-full hover:bg-opacity-80 transition-colors"
                                    aria-label="Admin Dashboard"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                    <span className="hidden sm:inline sm:ml-2">Admin</span>
                                </button>
                            </Tooltip>
                        )}
                        {view === 'creator' || view === 'visitor' ? (
                        <button onClick={handleSwitchRole} className="text-sm font-semibold text-primary hover:text-opacity-80 transition-colors whitespace-nowrap px-3 py-2">
                            Switch to {view === 'creator' ? 'Visitor' : 'Creator'}
                        </button>
                        ): null}
                    </>
                 )}
                <div className="relative" ref={themeMenuRef}>
                    <Tooltip content="Change Theme">
                        <motion.button
                            onClick={() => setIsThemeMenuOpen(o => !o)}
                            aria-label={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
                            className="h-10 w-10 flex items-center justify-center rounded-full text-on-surface-variant bg-surface-container-high hover:bg-outline/20 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <AnimatePresence mode="wait" initial={false}>
                            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                            </AnimatePresence>
                        </motion.button>
                    </Tooltip>
                  {isThemeMenuOpen && <ThemeMenu onClose={() => setIsThemeMenuOpen(false)} />}
                </div>
              </div>
            </div>
          </div>
        </header>
      )}

      <main className={showHeader ? "p-4 sm:p-6 lg:p-8 max-w-screen-2xl mx-auto" : ""}>
        {showProfileProvider ? (
            <MemorialProfileProvider memorialId={activeMemorialId}>
                {renderView()}
            </MemorialProfileProvider>
        ) : (
            renderView()
        )}
      </main>
    </div>
  );
};

export default App;
