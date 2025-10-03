import { useState } from 'react';
import { ADMIN_CREDENTIALS, setAuthenticated } from '../config/auth';

interface LoginFormProps {
  onLogin: (success: boolean) => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (credentials.username === ADMIN_CREDENTIALS.username && 
        credentials.password === ADMIN_CREDENTIALS.password) {
      // Store auth token in localStorage
      setAuthenticated(true);
      onLogin(true);
    } else {
      setError('Invalid username or password');
    }

    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-brand flex items-center justify-center">
      <div className="diagonal-stripes absolute inset-0 opacity-5"></div>
      <div className="relative max-w-md w-full mx-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-brand" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Admin Access</h1>
            <p className="text-brand-light">Enter your credentials to access the admin panel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-accent mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-accent/30 bg-white/10 text-white placeholder-brand-light px-4 py-3 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none transition-colors"
                placeholder="Enter username"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-accent mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-accent/30 bg-white/10 text-white placeholder-brand-light px-4 py-3 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none transition-colors"
                placeholder="Enter password"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
                <p className="text-red-400 font-medium text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 rounded-xl bg-accent text-brand font-bold hover:bg-accent-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-brand-light">
              Default credentials: {ADMIN_CREDENTIALS.username} / {ADMIN_CREDENTIALS.password}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
