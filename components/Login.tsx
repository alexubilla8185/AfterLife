import React from 'react';
import { useUser } from '../hooks/useUser';

interface LoginProps {
  onShowTour: () => void;
}

const Login: React.FC<LoginProps> = ({ onShowTour }) => {
  const { signInWithGoogle } = useUser();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-200 via-primary-100 to-slate-200 dark:from-slate-900 dark:via-primary-900/30 dark:to-black animated-gradient p-4 transition-colors duration-300">
      {/* Centered Login Card */}
      <div className="w-full max-w-md mx-auto bg-white/60 dark:bg-slate-800/60 backdrop-blur-2xl rounded-2xl shadow-2xl p-8 md:p-12 text-center border border-white/30 dark:border-slate-700/50">
        
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-primary-500 rounded-full shadow-lg">
             <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white">
                <path d="M12 3L10.5 8.5L5 10L10.5 11.5L12 17L13.5 11.5L19 10L13.5 8.5L12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold font-serif text-slate-800 dark:text-slate-100 tracking-tight mb-4">
          Welcome to AfterLife
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-lg mb-12 max-w-xl mx-auto">
          Sign in to begin your journey of remembrance and connection.
        </p>

        <div className="space-y-4">
          <button
            onClick={signInWithGoogle}
            className="group w-full flex items-center justify-center space-x-3 py-3 px-4 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm text-lg font-semibold text-slate-800 dark:text-slate-200 bg-white/70 dark:bg-slate-700/50 hover:bg-white dark:hover:bg-slate-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <svg className="w-6 h-6" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.223,0-9.655-3.657-11.303-8H6.306C9.656,35.663,16.318,40,24,40z"></path>
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.089,5.571l6.19,5.238C39.904,36.8,44,30.8,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
            </svg>
            <span>Sign in with Google</span>
          </button>
        </div>

      </div>

      {/* Floating "How it works" button */}
      <button
        onClick={onShowTour}
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
