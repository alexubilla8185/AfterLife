import React from 'react';

interface LoginProps {
  onNavigate: (view: 'creator' | 'visitor') => void;
  onShowOnboarding: () => void;
}

const Login: React.FC<LoginProps> = ({ onNavigate, onShowOnboarding }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-200 via-primary-100 to-slate-200 dark:from-slate-900 dark:via-primary-900/30 dark:to-black animated-gradient p-4 transition-colors duration-300">
      {/* Centered Login Card */}
      <div className="w-full max-w-2xl mx-auto bg-white/60 dark:bg-slate-800/60 backdrop-blur-2xl rounded-2xl shadow-2xl p-8 md:p-12 text-center border border-white/30 dark:border-slate-700/50">
        
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-primary-500 rounded-full shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold font-serif text-slate-800 dark:text-slate-100 tracking-tight mb-4">
          Welcome to AfterLife
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-lg mb-12 max-w-xl mx-auto">
          A space to build a digital legacy. Connect with the memory of loved ones through interactive stories and shared tributes.
        </p>

        <div className="grid sm:grid-cols-2 gap-6">
          <button
            onClick={() => onNavigate('visitor')}
            className="group w-full h-full flex items-center text-left p-5 bg-slate-50 dark:bg-slate-700/50 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <div className="p-3 bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-300 rounded-lg mr-5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Enter as a Visitor</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Explore a memorial and leave a tribute.</p>
            </div>
             <div className="ml-auto text-gray-300 dark:text-gray-500 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
             </div>
          </button>

          <button
            onClick={() => onNavigate('creator')}
            className="group w-full h-full flex items-center text-left p-5 bg-slate-50 dark:bg-slate-700/50 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <div className="p-3 bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-300 rounded-lg mr-5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Login as a Creator</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Manage your profile and build your legacy.</p>
            </div>
            <div className="ml-auto text-gray-300 dark:text-gray-500 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </div>
          </button>
        </div>

      </div>

      {/* Floating "How it works" button */}
      <button
        onClick={onShowOnboarding}
        aria-label="How does this work?"
        className="fixed bottom-4 right-4 h-12 w-12 md:h-14 md:w-14 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-full shadow-lg flex items-center justify-center text-primary-600 dark:text-primary-400 hover:bg-white dark:hover:bg-slate-700 hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 focus:ring-primary-500"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-7 md:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
    </div>
  );
};

export default Login;