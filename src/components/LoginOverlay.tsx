import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Store, Github } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../services/supabase';

interface LoginOverlayProps {
  onSuccess?: () => void;
}

// In-memory storage for credentials (not persisted to localStorage)
let storedCredentials: { email: string; password: string } | null = null;

export const LoginOverlay: React.FC<LoginOverlayProps> = ({ onSuccess }) => {
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [shopName, setShopName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load stored credentials from memory on mount
  useEffect(() => {
    if (storedCredentials) {
      setEmail(storedCredentials.email);
      setPassword(storedCredentials.password);
    }
  }, []);

  // Store credentials in memory when they change
  useEffect(() => {
    if (email && password) {
      storedCredentials = { email, password };
    }
  }, [email, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    if (!isLogin && !shopName.trim()) {
      setError('Please enter a shop name');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, shopName);
      }
      // Store credentials in memory after successful auth
      storedCredentials = { email, password };
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) {
        setError(error.message || 'GitHub sign-in failed');
        setLoading(false);
      }
      // OAuth redirect will happen, so we don't need to handle success here
    } catch (err) {
      setError(err instanceof Error ? err.message : 'GitHub sign-in failed');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 grid-background" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/30 dark:bg-black/30 light-mode:bg-black/10 backdrop-blur-sm"
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 25 }}
        className="relative w-full max-w-md mx-4"
      >
        <div className="glass-panel p-8 space-y-6">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="flex items-center justify-center gap-2"
          >
            <Store className="w-8 h-8 text-orange-400" />
            <h1 className="text-2xl font-bold gradient-text">StoreGPT</h1>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 light-mode:text-gray-700 mb-2">
                  Shop Name
                </label>
                <input
                  type="text"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="My Awesome Store"
                  className="glass-input w-full px-4 py-3 pl-10"
                />
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 light-mode:text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 dark:text-gray-400 light-mode:text-gray-600" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="glass-input w-full px-4 py-3 pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 light-mode:text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 dark:text-gray-400 light-mode:text-gray-600" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="glass-input w-full px-4 py-3 pl-10"
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold gradient-text border border-orange-500/50 bg-orange-500/10 hover:bg-orange-500/20 transition-all disabled:opacity-50"
            >
              {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Create Account'}
            </motion.button>
          </form>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="w-full py-3 text-gray-300 dark:text-gray-300 light-mode:text-gray-700 hover:text-white dark:hover:text-white light-mode:hover:text-gray-900 transition-colors text-sm"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </motion.button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-2 text-gray-400 dark:text-gray-400 light-mode:text-gray-600 bg-gray-950/50 dark:bg-gray-950/50 light-mode:bg-white/80">Or continue with</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleGitHubSignIn}
            disabled={loading}
            className="w-full py-3 glass-button text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Github className="w-5 h-5" />
            Sign in with GitHub
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
