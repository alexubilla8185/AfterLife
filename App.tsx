import React, { useState, useRef, useEffect } from 'react';
import CreatorDashboard from './components/CreatorDashboard';
import VisitorView from './components/VisitorView';
import Login from './components/Login';
import Onboarding from './components/Onboarding';
import ThemeMenu from './components/ThemeMenu';
import { useMemorialProfile } from './hooks/useMemorialProfile';
import LandingPage from './components/LandingPage';

type View = 'landing' | 'login' | 'creator' | 'visitor';
type OnboardingContext = 'creator' | 'visitor' | 'login';

const App: React.FC = () => {
  const [view, setView] = useState<View>('landing');
  const [onboardingContext, setOnboardingContext] = useState<OnboardingContext | null>(null);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  
  const { profile } = useMemorialProfile();
  
  const themeMenuRef = useRef<HTMLDivElement>(null);

  const handleEnterApp = () => {
    setView('login');
  };

  const handleNavigate = (newView: 'creator' | 'visitor') => {
    setView(newView);
  };
  
  const handleSwitchRole = () => {
    setView(prevView => prevView === 'creator' ? 'visitor' : 'creator');
  };

  const handleShowOnboarding = (context: OnboardingContext) => {
    setOnboardingContext(context);
  };
  
  const handleCloseOnboarding = () => {
    setOnboardingContext(null);
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

  const Header = () => (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-primary-500 icon-glow">
              <path d="M12 3L10.5 8.5L5 10L10.5 11.5L12 17L13.5 11.5L19 10L13.5 8.5L12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h1 className="text-3xl font-bold font-serif text-slate-900 dark:text-slate-100">AfterLife</h1>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <div className="relative" ref={themeMenuRef}>
              <button
                onClick={() => setIsThemeMenuOpen(prev => !prev)}
                className="flex items-center justify-center h-10 w-10 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                aria-label="Open theme menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
                </svg>
              </button>
              {isThemeMenuOpen && <ThemeMenu onClose={() => setIsThemeMenuOpen(false)} />}
            </div>
            <button
              onClick={() => handleShowOnboarding(view as OnboardingContext)}
              className="flex items-center space-x-2 px-3 py-2 border border-gray-200 dark:border-gray-700 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              aria-label="How it works"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="hidden sm:inline">How It Works</span>
            </button>
            <button
              onClick={handleSwitchRole}
              className="flex items-center space-x-2 px-3 py-2 border border-transparent text-sm font-medium rounded-md text-primary-600 dark:text-primary-300 bg-primary-100 dark:bg-primary-900/40 hover:bg-primary-200 dark:hover:bg-primary-900/60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <span className="hidden sm:inline">Switch Role</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
  
  if (view === 'landing') {
    return <LandingPage onEnter={handleEnterApp} />;
  }

  return (
    <>
      {onboardingContext && <Onboarding onComplete={handleCloseOnboarding} context={onboardingContext} />}

      {view === 'login' ? (
        <Login onNavigate={handleNavigate} onShowOnboarding={() => handleShowOnboarding('login')} />
      ) : (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
          <Header />
          <main className="py-8 sm:px-6 lg:px-8">
            {view === 'creator' && <div className="max-w-7xl mx-auto"><CreatorDashboard /></div>}
            {view === 'visitor' && <VisitorView profile={profile} />}
          </main>
        </div>
      )}
    </>
  );
};

export default App;
