"use client" 

import * as React from "react"
import { useState } from "react";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
 
interface SignInProps {
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
    rememberMe: boolean;
    setRememberMe: (value: boolean) => void;
    error: string | null;
    loading: boolean;
    onEmailSignIn: () => void;
    onGoogleSignIn: () => void;
    onFacebookSignIn: () => void;
}

const SignIn: React.FC<SignInProps> = ({
    email,
    setEmail,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    error,
    loading,
    onEmailSignIn,
    onGoogleSignIn,
    onFacebookSignIn,
}) => {
  const [showPassword, setShowPassword] = useState(false);
 
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEmailSignIn();
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-surface p-4 transition-colors duration-300">
      <div className="w-full max-w-sm bg-surface-container rounded-3xl shadow-xl p-8 flex flex-col items-center border border-outline/30 text-on-surface">
        
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-surface mb-6 shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-8 w-8 text-primary">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold mb-2 text-center text-on-surface">
          Welcome to AfterLife
        </h2>
        <p className="text-on-surface-variant text-sm mb-6 text-center">
          Your story continues here. Sign in to get started.
        </p>
        
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/70">
              <Mail className="w-4 h-4" />
            </span>
            <input
              placeholder="Email"
              type="email"
              value={email}
              className="w-full pl-10 pr-3 py-3 rounded-xl border border-outline/50 focus:outline-none focus:ring-2 focus:ring-primary bg-surface-variant text-on-surface text-sm"
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/70">
              <Lock className="w-4 h-4" />
            </span>
            <input
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              className="w-full pl-10 pr-10 py-3 rounded-xl border border-outline/50 focus:outline-none focus:ring-2 focus:ring-primary bg-surface-variant text-on-surface text-sm"
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/70 hover:text-on-surface-variant"
                aria-label={showPassword ? "Hide password" : "Show password"}
            >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex items-center justify-between w-full mt-1 text-sm">
            <div className="flex items-center">
                <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-outline/50 bg-surface-variant text-primary focus:ring-primary"
                    disabled={loading}
                />
                <label htmlFor="remember-me" className="ml-2 block text-on-surface-variant">
                    Remember me
                </label>
            </div>
            <a href="#" className="font-medium text-primary hover:text-opacity-80 transition-colors">
                Forgot password?
            </a>
          </div>
          <div className="w-full h-4 mt-1">
            {error && (
              <p className="text-sm text-red-500 text-left">{error}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-on-primary font-medium py-3 rounded-xl shadow hover:bg-opacity-90 cursor-pointer transition disabled:opacity-50 mt-2"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="flex items-center w-full my-4">
          <div className="flex-grow border-t border-dashed border-outline/50"></div>
          <span className="mx-4 text-xs text-on-surface-variant">Or sign in with</span>
          <div className="flex-grow border-t border-dashed border-outline/50"></div>
        </div>

        <div className="flex gap-3 w-full justify-center mt-2">
          <button onClick={onGoogleSignIn} disabled={loading} className="flex items-center justify-center w-12 h-12 rounded-xl border border-outline bg-surface-container hover:bg-surface-container-high transition grow disabled:opacity-50">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-6 h-6"
            />
          </button>
          <button onClick={onFacebookSignIn} disabled={loading} className="flex items-center justify-center w-12 h-12 rounded-xl border border-outline bg-surface-container hover:bg-surface-container-high transition grow disabled:opacity-50">
            <img
              src="https://www.svgrepo.com/show/448224/facebook.svg"
              alt="Facebook"
              className="w-6 h-6"
            />
          </button>
        </div>
      </div>
    </div>
  );
};
 
export { SignIn };
