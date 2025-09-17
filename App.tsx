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
import { supabase } from './services/supabaseClient';

type View = 'landing' | 'login' | 'creator' | 'visitor' | 'profile';
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


const App: React.FC = () => {
  const { user } = useUser();
  const [view, setView] = useState<View>('landing');
  const [activeMemorialId, setActiveMemorialId] = useState<string | null>(null);
  const [tourContext, setTourContext] = useState<TourContext | null>(null);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
    
  const themeMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
            const newId = await seedInitialData(user.id);
            if (newId) setActiveMemorialId(newId);
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
      if (prevView === 'profile') {
        return 'visitor'; // Default to visitor view from profile
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

  const Header = () => (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-primary-500 icon-glow">
              <path d="M12 3L10.5 8.5L5 10L10.5 11.5L12 17L13.5 11.5L19 10L13.5 8.5L12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="flex items-baseline">
              <h1 className="text-3xl font-bold font-serif text-slate-900 dark:text-slate-100">AfterLife</h1>
              <span className="ml-3 text-xs font-semibold uppercase tracking-wider bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 px-2 py-1 rounded-full">
                PoC
              </span>
            </div>
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
              onClick={() => setView('profile')}
              className="flex items-center space-x-2 px-3 py-2 border border-gray-200 dark:border-gray-700 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              aria-label="My Profile"
            >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
               </svg>
              <span className="hidden sm:inline">My Profile</span>
            </button>

            {view !== 'profile' && (
              <button
                onClick={() => handleShowTour(view as TourContext)}
                className="hidden md:flex items-center space-x-2 px-3 py-2 border border-gray-200 dark:border-gray-700 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                aria-label="How it works"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="hidden sm:inline">How It Works</span>
              </button>
            )}

            <button
              onClick={handleSwitchRole}
              className="flex items-center space-x-2 px-3 py-2 border border-transparent text-sm font-medium rounded-md text-primary-600 dark:text-primary-300 bg-primary-100 dark:bg-primary-900/40 hover:bg-primary-200 dark:hover:bg-primary-900/60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <span className="hidden sm:inline">{view === 'profile' ? 'Back to Visitor' : 'Switch Role'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
  
  if (view === 'landing') {
    return <LandingPage onEnter={handleEnterApp} />;
  }

  const renderContent = () => {
    switch(view) {
        case 'creator':
            return <CreatorDashboard showTour={tourContext === 'creator'} onTourFinish={handleCloseTour} />;
        case 'visitor':
            return <VisitorView showTour={tourContext === 'visitor'} onTourFinish={handleCloseTour} />;
        case 'profile':
            return <ProfilePage onNavigate={(view, id) => handleNavigate(view, id)} />;
        default:
             return null;
    }
  };


  return (
    <MemorialProfileProvider memorialId={activeMemorialId}>
      {tourContext === 'login' && <LoginTour onClose={handleCloseTour} />}

      {!user ? (
        <Login onShowTour={() => handleShowTour('login')} />
      ) : (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
          <Header />
          <main className="py-8 sm:px-6 lg:px-8">
            {renderContent()}
          </main>
        </div>
      )}
    </MemorialProfileProvider>
  );
};

export default App;