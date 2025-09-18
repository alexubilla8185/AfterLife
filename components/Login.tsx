import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../hooks/useUser';
import { SignIn } from './ui/clean-minimal-sign-in';

const Login: React.FC = () => {
  const { signInWithGoogle, signInWithEmail } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showComingSoon && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll('button') as NodeListOf<HTMLElement>;
        const firstElement = focusableElements[0];
        
        firstElement?.focus();

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setShowComingSoon(false);
            if (e.key === 'Tab') {
                e.preventDefault();
                firstElement.focus();
            }
        };
        
        const currentModalRef = modalRef.current;
        currentModalRef.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keydown', handleKeyDown);

        return () => {
          currentModalRef?.removeEventListener('keydown', handleKeyDown);
          window.removeEventListener('keydown', handleKeyDown);
        }
    }
  }, [showComingSoon]);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleEmailSignIn = async () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError(null);
    setLoading(true);

    // For this app, sign-in is the primary action. We don't have a sign-up flow on this screen.
    const { error: authError } = await signInWithEmail({ email, password });

    if (authError) {
      // Provide a more helpful message since there's no sign-up form.
      if (authError.message.includes("Invalid login credentials")) {
        setError("Invalid email or password. New here? Please contact support for early access.");
      } else {
        setError(authError.message);
      }
    }
    // On success, the useUser hook will redirect automatically.
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    await signInWithGoogle();
    // setLoading(false) is not strictly necessary as the page will redirect, but good practice.
    setLoading(false);
  };

  return (
    <>
      <SignIn
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        rememberMe={rememberMe}
        setRememberMe={setRememberMe}
        error={error}
        loading={loading}
        onEmailSignIn={handleEmailSignIn}
        onGoogleSignIn={handleGoogleSignIn}
        onFacebookSignIn={() => setShowComingSoon(true)}
      />
      
      {showComingSoon && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity animate-fade-in">
          <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="coming-soon-title" className="bg-surface-container-high rounded-3xl p-6 w-full max-w-sm mx-auto border border-outline text-center">
            <h3 id="coming-soon-title" className="text-lg font-semibold text-on-surface">Feature Coming Soon</h3>
            <p className="mt-2 text-sm text-on-surface-variant">
                This sign-in method will be available shortly. Please use Google or Email to sign in for now.
            </p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowComingSoon(false)}
                className="w-full px-5 py-2.5 text-sm font-medium text-on-primary bg-primary rounded-full hover:bg-opacity-80"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
