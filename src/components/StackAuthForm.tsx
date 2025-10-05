import React, { useState } from 'react';
import { useSimpleAuth } from '../context/SimpleAuthContext';

interface StackAuthFormProps {
  mode: 'signin' | 'signup';
  onSuccess?: () => void;
}

export const StackAuthForm: React.FC<StackAuthFormProps> = ({ mode, onSuccess }) => {
  const { signIn, signUp, isLoading } = useSimpleAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      let success = false;
      
      if (mode === 'signin') {
        success = await signIn(email, password);
      } else {
        if (!name.trim()) {
          setError('Name is required');
          return;
        }
        success = await signUp(email, password, name);
      }

      if (success) {
        onSuccess?.();
      } else {
        setError(mode === 'signin' ? 'Invalid credentials' : 'Sign up failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <div className="h-16 w-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-brand font-bold text-2xl">JP</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {mode === 'signin' ? 'Sign In' : 'Sign Up'}
          </h2>
          <p className="text-gray-600">
            {mode === 'signin' 
              ? 'Sign in to access the admin panel' 
              : 'Create an account to get started'
            }
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required={mode === 'signup'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand focus:border-brand"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand focus:border-brand"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand focus:border-brand"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {mode === 'signin' ? 'Signing In...' : 'Signing Up...'}
                </div>
              ) : (
                mode === 'signin' ? 'Sign In' : 'Sign Up'
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              {mode === 'signin' ? (
                <>
                  Don't have an account?{' '}
                  <a href="/auth/signup" className="font-medium text-brand hover:text-brand-dark">
                    Sign up
                  </a>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <a href="/auth/signin" className="font-medium text-brand hover:text-brand-dark">
                    Sign in
                  </a>
                </>
              )}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StackAuthForm;
