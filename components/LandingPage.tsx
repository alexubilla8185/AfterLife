import React from 'react';
import { SparklesCore } from './ui/sparkles';
import { View } from '../App';

const FeatureCard: React.FC<{ icon: JSX.Element; title: string; children: React.ReactNode; }> = ({ icon, title, children }) => (
    <div className="bg-surface-container p-6 rounded-3xl border border-outline/30">
        <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary-container text-on-primary-container mb-5">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-2 text-on-surface">{title}</h3>
        <p className="text-on-surface-variant">{children}</p>
    </div>
);

const LandingPage: React.FC<{ onNavigate: (view: View) => void }> = ({ onNavigate }) => {
  return (
    <div className="bg-surface text-on-surface">
      <header className="absolute top-0 left-0 right-0 z-30 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-7 w-7 text-primary">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            <span className="font-bold text-xl text-on-surface">AfterLife</span>
          </div>
           <div>
            <button onClick={() => onNavigate('how-it-works')} className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">How it Works</button>
          </div>
        </div>
      </header>
      
      <main>
        <section className="relative flex flex-col items-center justify-center text-center overflow-hidden p-4 min-h-screen bg-surface-container">
           <div className="w-full absolute inset-0 h-screen">
            <SparklesCore
              id="tsparticlesfullpage"
              background="transparent"
              minSize={0.6}
              maxSize={1.4}
              particleDensity={100}
              className="w-full h-full"
              particleColor="#FFFFFF"
              speed={1}
            />
          </div>
          <div className="relative z-20 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-extrabold text-on-surface tracking-tight">
              Your Story Doesn't End Here.
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-on-surface-variant">
              Create a living memorial—an interactive space where your memories, stories, and wisdom can be shared and cherished for generations to come.
            </p>
            <button 
                onClick={() => onNavigate('login')} 
                className="mt-12 px-8 py-4 text-lg font-semibold text-on-primary bg-primary rounded-full shadow-lg hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface-container focus:ring-primary transform hover:scale-105 transition-all"
            >
              Explore the Alpha Demo
            </button>
          </div>
        </section>

        <section id="features" className="py-20 sm:py-32 bg-surface">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-on-surface">A New Form of Remembrance</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-on-surface-variant">AfterLife offers two unique ways to connect with a legacy, whether you're building your own or visiting another's.</p>
                </div>
                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>}
                        title="Craft Your Legacy"
                    >
                        As a Creator, you can build a beautiful profile, share your story, and link to your blogs or photo galleries.
                    </FeatureCard>
                    <FeatureCard
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                        title="Interactive Chat"
                    >
                        Program custom responses to keywords, allowing loved ones to receive personal messages you've written just for them.
                    </FeatureCard>
                    <FeatureCard
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-5.998 12.078 12.078 0 01.665-6.479L12 14z" /><path d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-5.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222 4 2.222V16" /></svg>}
                        title="Shared Tribute Wall"
                    >
                        Visitors can leave public messages of love and remembrance, creating a communal space for healing and connection.
                    </FeatureCard>
                </div>
            </div>
        </section>
      </main>

      <footer className="bg-surface-container border-t border-outline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-on-surface-variant">
          <div className="flex justify-center space-x-6 text-sm">
            <button onClick={() => onNavigate('how-it-works')} className="hover:text-primary transition-colors">How it Works</button>
            <button onClick={() => onNavigate('privacy')} className="hover:text-primary transition-colors">Privacy Policy</button>
            <button onClick={() => onNavigate('data-deletion')} className="hover:text-primary transition-colors">Data Deletion</button>
          </div>
          <p className="mt-4 text-xs">&copy; {new Date().getFullYear()} AfterLife. A place for stories that last forever.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;