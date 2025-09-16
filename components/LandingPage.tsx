import React from 'react';

const FeatureCard: React.FC<{ icon: JSX.Element; title: string; children: React.ReactNode; }> = ({ icon, title, children }) => (
    <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg p-6 rounded-xl border border-white/30 dark:border-slate-700/50 shadow-lg">
        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary-500 text-white mb-4 shadow-md">
            {icon}
        </div>
        <h3 className="text-xl font-bold font-serif mb-2 text-slate-900 dark:text-slate-100">{title}</h3>
        <p className="text-slate-600 dark:text-slate-300">{children}</p>
    </div>
);

const LandingPage: React.FC<{ onEnter: () => void }> = ({ onEnter }) => {
  return (
    <div className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200">
      <header className="absolute top-0 left-0 right-0 z-20 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-primary-500">
                <path d="M12 3L10.5 8.5L5 10L10.5 11.5L12 17L13.5 11.5L19 10L13.5 8.5L12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-bold text-xl font-serif text-slate-900 dark:text-slate-100">AfterLife</span>
          </div>
          <button 
            onClick={onEnter} 
            className="px-5 py-2 text-sm font-semibold text-primary-600 dark:text-primary-300 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-full shadow-md hover:bg-white dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all"
          >
              Enter App
          </button>
        </div>
      </header>
      
      <main>
        <section className="relative h-screen flex items-center justify-center text-center overflow-hidden p-4">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-primary-100 to-slate-200 dark:from-slate-900 dark:via-primary-900/30 dark:to-black animated-gradient"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.04%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50 dark:opacity-100"></div>

          <div className="relative z-10 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-extrabold font-serif text-slate-900 dark:text-slate-100 tracking-tight">
              Your Story Doesn't End Here.
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-slate-600 dark:text-slate-300">
              Create a living memorial—an interactive space where your memories, stories, and wisdom can be shared and cherished for generations to come.
            </p>
            <button 
                onClick={onEnter} 
                className="mt-12 px-8 py-4 text-lg font-semibold text-white bg-primary-600 rounded-full shadow-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transform hover:scale-105 transition-all"
            >
              Get Started
            </button>
          </div>
        </section>

        <section id="features" className="py-20 sm:py-32 bg-slate-50 dark:bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-4xl font-bold font-serif text-slate-900 dark:text-slate-100">A New Form of Remembrance</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400">AfterLife offers two unique ways to connect with a legacy, whether you're building your own or visiting another's.</p>
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

      <footer className="bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-slate-500">
          <p>&copy; {new Date().getFullYear()} AfterLife. A place for stories that last forever.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
