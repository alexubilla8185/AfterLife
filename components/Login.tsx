import React, { useState } from 'react';
import { useUser } from '../hooks/useUser';
import { SignIn } from './ui/clean-minimal-sign-in';
import { useDialog } from '../hooks/useDialog';

const Login: React.FC = () => {
  const { signInWithGoogle, signInWithEmail } = useUser();
  const { showDialog } = useDialog();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

    const { error: authError } = await signInWithEmail({ email, password });

    if (authError) {
      if (authError.message.includes("Invalid login credentials")) {
        setError("Invalid email or password. New here? Please contact support for early access.");
      } else {
        setError(authError.message);
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

  return (
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
        onFacebookSignIn={handleComingSoon}
    />
  );
};

export default Login;