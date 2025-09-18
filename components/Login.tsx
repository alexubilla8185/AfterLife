import React, { useState } from 'react';
import { useUser } from '../hooks/useUser';

interface LoginProps {
  onShowTour: () => void;
}

type AuthTab = 'signIn' | 'signUp';

const Login: React.FC<LoginProps> = ({ onShowTour }) => {
  const { signInWithGoogle, signInWithFacebook, signInWithEmail, signUpWithEmail } = useUser();
  const [activeTab, setActiveTab] = useState<AuthTab>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const credentials = { email, password };
    const { error: authError } = activeTab === 'signIn' 
        ? await signInWithEmail(credentials) 
        : await signUpWithEmail(credentials);

    if (authError) {
      setError(authError.message);
    } else if (activeTab === 'signUp') {
      setSuccessMessage('Success! Please check your email for a confirmation link to complete your registration.');
      setEmail('');
      setPassword('');
    }
    setLoading(false);
  }

  const SocialButton: React.FC<{ provider: 'google' | 'facebook', onClick: () => void, disabled?: boolean }> = ({ provider, onClick, disabled = false }) => {
    const icons = {
      google: <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.565-3.343-11.114-7.923l-6.571,4.819C9.656,39.663,16.318,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.902,35.61,44,30.451,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>,
      facebook: <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" aria-hidden="true"><linearGradient id="a" x1="24" x2="24" y1="4.001" y2="44.001" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#0d87ff"/><stop offset="1" stopColor="#0561e1"/></linearGradient><path fill="url(#a)" d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"/><path fill="#fff" d="M30,34.5v-10h4l0.5-5h-4.5v-2.5c0-1.5,0.5-2.5,2.5-2.5H35v-5h-4c-5,0-7,3-7,7v3h-4v5h4v10H30z"/></svg>
    };
    const text = provider === 'google' ? 'Continue with Google' : 'Continue with Facebook';

    return (
        <button 
            onClick={onClick}
            disabled={disabled}
            className="w-full flex justify-center items-center py-3 px-4 border border-outline rounded-full bg-surface-container hover:bg-surface-container-high text-sm font-medium text-on-surface transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <span className="mr-3">{icons[provider]}</span>{text}
        </button>
    );
  };
  
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-surface p-4 transition-colors duration-300">
      <div className="w-full max-w-md mx-auto bg-surface-container rounded-3xl p-8 md:p-10 text-center border border-outline/30">
        
        <div className="flex justify-center mb-4">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-10 w-10 text-primary">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
           </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-on-surface">Welcome to AfterLife</h1>
        <p className="mt-2 text-on-surface-variant">Your story continues here.</p>
        
        <div className="mt-8 space-y-4">
            <SocialButton provider="google" onClick={signInWithGoogle} />
            <div>
              <SocialButton provider="facebook" onClick={() => {}} disabled={true} />
              <p className="text-xs text-center text-on-surface-variant/70 mt-1">Facebook login coming soon.</p>
            </div>
        </div>

        <div className="mt-6 flex items-center">
            <div className="flex-grow border-t border-outline"></div>
            <span className="flex-shrink mx-4 text-on-surface-variant text-sm">OR</span>
            <div className="flex-grow border-t border-outline"></div>
        </div>
        
        <div className="mt-6">
            <div className="flex bg-surface-variant rounded-full p-1 mb-6">
                <button onClick={() => { setActiveTab('signIn'); setError(null); setSuccessMessage(null); }} className={`flex-1 text-sm py-2 rounded-full font-semibold transition-all ${activeTab === 'signIn' ? 'bg-secondary-container shadow text-on-secondary-container' : 'text-on-surface-variant'}`}>Sign In</button>
                <button onClick={() => { setActiveTab('signUp'); setError(null); setSuccessMessage(null); }} className={`flex-1 text-sm py-2 rounded-full font-semibold transition-all ${activeTab === 'signUp' ? 'bg-secondary-container shadow text-on-secondary-container' : 'text-on-surface-variant'}`}>Sign Up</button>
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-4 text-left">
                <div>
                    <label htmlFor="email-input" className="sr-only">Email address</label>
                    <input id="email-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" required className="w-full px-4 py-3 bg-surface-variant border border-outline/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-on-surface" />
                </div>
                <div>
                    <label htmlFor="password-input" className="sr-only">Password</label>
                    <input id="password-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required className="w-full px-4 py-3 bg-surface-variant border border-outline/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-on-surface" />
                </div>
                <button type="submit" disabled={loading} className="w-full py-3 px-4 border border-transparent rounded-full text-sm font-medium text-on-primary bg-primary hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50">
                    {loading ? 'Processing...' : (activeTab === 'signIn' ? 'Sign In' : 'Create Account')}
                </button>
            </form>

            {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
            {successMessage && <p className="mt-4 text-sm text-green-500">{successMessage}</p>}
        </div>

        <div className="mt-8 text-sm">
            <button onClick={onShowTour} className="text-on-surface-variant hover:text-primary underline transition-colors">Take a Tour</button>
        </div>

      </div>
    </div>
  );
};

export default Login;