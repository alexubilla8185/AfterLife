import React from 'react';
import { SparklesCore } from './ui/sparkles';
import { View } from '../App';
import Tooltip from './ui/Tooltip';

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
            <Tooltip content="How it Works">
                <button
                    onClick={() => onNavigate('how-it-works')}
                    aria-label="How it Works"
                    className="h-10 w-10 flex items-center justify-center rounded-full text-primary bg-primary-container/30 hover:bg-primary-container/60 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>
            </Tooltip>
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
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                    onClick={() => onNavigate('login')} 
                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-full text-on-primary bg-primary shadow-lg hover:bg-opacity-90 transition-transform hover:scale-105"
                >
                    Get Early Access
                </button>
                <button 
                    onClick={() => onNavigate('demoVisitor')} 
                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-full text-on-surface-variant bg-surface-container-high border border-outline hover:bg-outline/20 transition-colors"
                >
                   View Live Demo
                </button>
            </div>
          </div>
        </section>
        
        <section id="how-it-works" className="py-20 md:py-32 bg-surface">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-4xl font-extrabold text-on-surface tracking-tight">A Space for Remembrance & Connection</h2>
                    <p className="mt-4 max-w-3xl mx-auto text-lg text-on-surface-variant">AfterLife offers two unique experiences: one for creating a legacy, and one for connecting with it.</p>
                </div>
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>}
                        title="Craft Your Legacy"
                    >
                        As a Creator, build a digital memorial. Share your story, record your voice, and set custom replies for visitors.
                    </FeatureCard>
                    <FeatureCard
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.08-3.239A8.931 8.931 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7z" clipRule="evenodd" /></svg>}
                        title="Connect & Converse"
                    >
                        As a Visitor, interact with a memorial's spirit. Receive custom messages or gentle, AI-powered reflections.
                    </FeatureCard>
                    <FeatureCard
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>}
                        title="Share Tributes"
                    >
                        Leave a public message on the Tribute Wall. Share memories and stories, creating a communal space for remembrance.
                    </FeatureCard>
                </div>
            </div>
        </section>
      </main>

      <footer className="bg-surface-container border-t border-outline/30">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-on-surface-variant">&copy; {new Date().getFullYear()} AfterLife. All rights reserved.</p>
            <div className="mt-4 flex justify-center space-x-6">
                <button onClick={() => onNavigate('privacy')} className="text-sm text-on-surface-variant hover:text-primary transition-colors">Privacy Policy</button>
                <button onClick={() => onNavigate('data-deletion')} className="text-sm text-on-surface-variant hover:text-primary transition-colors">Data Deletion</button>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
