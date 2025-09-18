import React, { useState } from 'react';
import { useUser } from '../hooks/useUser';
import { SignIn } from './ui/clean-minimal-sign-in';
import { useDialog } from '../hooks/useDialog';

const Login: React.FC = () => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useUser();
  const { showDialog } = useDialog();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleFormSubmit = async () => {
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
     if (!password) {
      setError("Please enter a password.");
      return;
    }
    setError(null);
    setLoading(true);

    if (isSignUp) {
        if (!fullName.trim()) {
            setError("Please enter your full name.");
            setLoading(false);
            return;
        }
        const { error: signUpError } = await signUpWithEmail({ email, password, fullName });
        if (signUpError) {
            setError(signUpError.message);
        } else {
            showDialog({
                title: 'Check your email to confirm',
                message: `We've sent a confirmation link to ${email}. Please check your inbox to complete your registration.`
            });
            // Reset form and switch to sign-in view
            setIsSignUp(false);
            setFullName('');
            setEmail('');
            setPassword('');
        }
    } else {
        const { error: signInError } = await signInWithEmail({ email, password });
        if (signInError) {
          if (signInError.message.includes("Invalid login credentials")) {
            setError("Invalid email or password. Please try again.");
          } else if (signInError.message.includes("Email not confirmed")) {
            setError("Please confirm your email address before signing in.");
          }
          else {
            setError(signInError.message);
          }
        }
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    await signInWithGoogle();
    setLoading(false);
  };

  const handleComingSoon = () => {
    showDialog({
        title: 'Feature Coming Soon',
        message: 'This sign-in method will be available shortly. Please use Google or Email to sign in for now.',
    });
  };
  
  // Clear error when switching modes
  const handleSetIsSignUp = (value: boolean) => {
    setError(null);
    setIsSignUp(value);
  }

  return (
    <SignIn
        isSignUp={isSignUp}
        setIsSignUp={handleSetIsSignUp}
        fullName={fullName}
        setFullName={setFullName}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        rememberMe={rememberMe}
        setRememberMe={setRememberMe}
        error={error}
        loading={loading}
        onFormSubmit={handleFormSubmit}
        onGoogleSignIn={handleGoogleSignIn}
        onFacebookSignIn={handleComingSoon}
    />
  );
};

export default Login;