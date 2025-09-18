import React, { useState, useRef, useEffect } from 'react';
import CreatorDashboard from './components/CreatorDashboard';
import VisitorView from './components/VisitorView';
import Login from './components/Login';
import LoginTour from './components/LoginTour';
import ThemeMenu from './components/ThemeMenu';
import { MemorialProfileProvider } from './hooks/useMemorialProfile';
import LandingPage from './components/LandingPage';
import ProfilePage from './components/ProfilePage';
import { useUser } from './hooks/useUser';
import { getSupabase } from './services/supabaseClient';
import AdminPage from './components/AdminPage';
import PrivacyPolicy from './components/PrivacyPolicy';
import DataDeletion from './components/DataDeletion';

type View = 'landing' | 'login' | 'creator' | 'visitor' | 'profile' | 'admin';
type TourContext = 'creator' | 'visitor' | 'login';

// Sample data to be seeded for the first user
const sampleProfileData = {
    name: 'Julia Hayes',
    life_span: '1968 - 2023',
    bio: 'An insatiable traveler, a captivating storyteller, and a devoted teacher. Julia believed the world was a classroom and every person a story waiting to be told. She collected moments, not things.',
    profile_image_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286de2?w=256&h=256&fit=crop&q=80',
};
const sampleResponsesData = [ { keyword: 'miss you', response: 'The journey doesn\'t end here. Think of our time together as a beautiful chapter, not the whole story. The adventure continues, just in a different way.' }, { keyword: 'travel', response: 'Ah, the open road! I hope you\'re still exploring. There\'s so much beauty to see. Don\'t ever lose your sense of wonder.' }, { keyword: 'story', response: 'Every story we shared is a landmark on the map of my heart. Tell them often, and keep the pages turning.' }, { keyword: 'sad', response: 'It\'s alright to feel lost sometimes. Every traveler needs a moment to rest. Remember the good trails we walked together, and let that be your guide.' }, { keyword: 'learn', response: 'The best lesson I ever taught was to stay curious. Keep asking questions, keep seeking answers. The world is full of things to discover.' }, { keyword: 'thank you', response: 'For walking this path with me for a while. It meant the world.' },];
const sampleSocialLinksData = [ { platform: 'Travel Blog', url: 'https://example.com' }, { platform: 'Photography', url: 'https://example.com/photos' }, { platform: 'Goodreads', url: 'https://goodreads.com/example' },];
const sampleTributesData = [ { author: 'Her former student, Anya', message: 'Ms. Hayes taught me more than just history; she taught me how to see the world. Her stories from her travels made every lesson an adventure. I\'ll carry her wisdom with me always.'}, { author: 'Leo, her travel buddy', message: 'Julia, my friend, the trails are quieter without you. From the mountains of Peru to the markets of Marrakech, every step was a joy. Cheers to one last sunset. You are missed.'}, { author: 'Her sister, Clara', message: 'My sister lived a dozen lifetimes in one. She sent postcards from every corner of the earth, each one filled with wonder. I\'ll miss her calls from faraway places. Rest easy, dear sister.'},];

interface AppProps {
  isOffline: boolean;
}

const App: React.FC<AppProps> = ({ isOffline }) => {
  const { user } = useUser();
  const [view, setView] = useState<View>('landing');
  const [activeMemorialId, setActiveMemorialId] = useState<string | null>(null);
  const [tourContext, setTourContext] = useState<TourContext | null>(null);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
    
  const themeMenuRef = useRef<HTMLDivElement>(null);

  // Simple router for static pages like Privacy Policy
  const path = window.location.pathname;
  if (path === '/privacy') {
    return <PrivacyPolicy />;
  }
  if (path === '/data-deletion') {
    return <DataDeletion />;
  }

  useEffect(() => {
    const supabase = getSupabase();
    const seedInitialData = async (userId: string) => {
        console.log("Seeding initial data for new user...");
        const { data: memorialData, error: memorialError } = await supabase
          .from('memorials').insert({ ...sampleProfileData, user_id: userId }).select().single();
        if (memorialError || !memorialData) { console.error("Error seeding memorial profile:", memorialError); return; }
        const newMemorialId = memorialData.id;
        await supabase.from('conditional_responses').insert(sampleResponsesData.map(r => ({ ...r, memorial_id: newMemorialId })));
        await supabase.from('social_links').insert(sampleSocialLinksData.map(l => ({ ...l, memorial_id: newMemorialId })));
        await supabase.from('tributes').insert(sampleTributesData.map(t => ({ ...t, memorial_id: newMemorialId })));
        console.log("Seeding complete.");
        return newMemorialId;
    };

    const checkAndSetInitialMemorial = async () => {
        if (!user) return;
        
        // Check if user has any memorials
        const { data, error } = await supabase.from('memorials').select('id').eq('user_id', user.id);

        if (error) { console.error("Error checking for memorials:", error); return; }

        if (data && data.length > 0) {
            // User has memorials, set the first one as active
            setActiveMemorialId(data[0].id);
        } else {
            // This is likely a new user, seed the data for them
            if (isSeeding) return; // Prevent race condition / double seeding
            setIsSeeding(true);
            const newId = await seedInitialData(user.id);
            if (newId) setActiveMemorialId(newId);
            setIsSeeding(false);
        }
    };
    
    if (user && (view === 'login' || view === 'landing')) {
        setView('profile');
        checkAndSetInitialMemorial();
    }
    if (!user && view !== 'landing') {
        setView('login');
        setActiveMemorialId(null);
    }
  }, [user, view]);


  const handleEnterApp = () => {
    setView('login');
  };

  const handleNavigate = (newView: 'creator' | 'visitor', memorialId: string) => {
    setActiveMemorialId(memorialId);
    setView(newView);
    
    if (newView === 'creator' || newView === 'visitor') {
      const tourSeenKey = newView === 'creator' ? 'creatorTourSeen' : 'visitorTourSeen';
      if (!localStorage.getItem(tourSeenKey)) {
          setTimeout(() => setTourContext(newView), 500);
      }
    }
  };
  
  const handleSwitchRole = () => {
    setView(prevView => {
      if (prevView === 'profile' || prevView === 'admin') {
        // From profile/admin, there's no clear creator/visitor context, so default to visitor.
        // Requires a memorialId to be set.
        if(activeMemorialId) return 'visitor';
        return prevView; // Stay on page if no memorial is active
      }
      const newView = prevView === 'creator' ? 'visitor' : 'creator';
      const tourSeenKey = newView === 'creator' ? 'creatorTourSeen' : 'visitorTourSeen';
      if (!localStorage.getItem(tourSeenKey)) {
          setTimeout(() => setTourContext(newView), 500);
      }
      return newView;
    });
  };

  const handleShowTour = (context: TourContext) => {
    setTourContext(context);
  };
  
  const handleCloseTour = () => {
    setTourContext(null);
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
        return <LandingPage onEnter={handleEnterApp} />;
      case 'login':
        return <Login onShowTour={() => handleShowTour('login')} />;
      case 'profile':
        return <ProfilePage onNavigate={handleNavigate} />;
      case 'admin':
        return <AdminPage />;
      case 'creator':
        return <CreatorDashboard showTour={tourContext === 'creator'} onTourFinish={handleCloseTour} />;
      case 'visitor':
        return <VisitorView showTour={tourContext === 'visitor'} onTourFinish={handleCloseTour} />;
      default:
        return <LandingPage onEnter={handleEnterApp} />;
    }
  };

  const showHeader = view !== 'landing' && view !== 'login';
  const showProfileProvider = view === 'creator' || view === 'visitor';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {isOffline && (
          <div className="bg-yellow-400 dark:bg-yellow-600 text-yellow-900 dark:text-yellow-100 text-center p-2 text-sm font-semibold sticky top-0 z-50">
            Offline Mode: Backend features are disabled.
          </div>
        )}

      {tourContext === 'login' && <LoginTour onClose={handleCloseTour} />}
      
      {showHeader && (
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-8 w-8 text-primary-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
                <div className="flex items-baseline space-x-2">
                  <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">AfterLife</h1>
                  <span className="text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-2 py-0.5 rounded-full">Alpha</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                 {view !== 'profile' && user && (
                  <button onClick={() => setView('profile')} className="hidden sm:inline-flex items-center space-x-2 px-3 py-1.5 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      <span>My Profile</span>
                  </button>
                 )}
                 {user?.role === 'admin' && view !== 'admin' && (
                    <button onClick={() => setView('admin')} className="hidden sm:inline-flex items-center space-x-2 px-3 py-1.5 border border-yellow-400/50 dark:border-yellow-600/50 text-sm font-medium rounded-md text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/40 hover:bg-yellow-100 dark:hover:bg-yellow-900/60 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        <span>Admin</span>
                    </button>
                 )}
                 {view === 'creator' || view === 'visitor' ? (
                  <button onClick={handleSwitchRole} className="text-sm font-semibold text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 transition-colors">
                    Switch to {view === 'creator' ? 'Visitor' : 'Creator'} View
                  </button>
                 ): null}
                <div className="relative" ref={themeMenuRef}>
                  <button onClick={() => setIsThemeMenuOpen(o => !o)} aria-label="Open theme menu" className="h-10 w-10 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a4 4 0 014-4h10a4 4 0 014 4v12a4 4 0 01-4 4H7z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18" />
                    </svg>
                  </button>
                  {isThemeMenuOpen && <ThemeMenu onClose={() => setIsThemeMenuOpen(false)} />}
                </div>
              </div>
            </div>
          </div>
        </header>
      )}

      <main className={showHeader ? "p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto" : ""}>
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