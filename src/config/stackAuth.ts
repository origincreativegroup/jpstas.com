import { StackServerApp } from '@stackframe/stack';

// Stack Auth configuration
export const stackServerApp = new StackServerApp({
  tokenStore: 'nextjs-cookie',
  urls: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    afterSignIn: '/admin',
    afterSignUp: '/admin',
  },
});

// Client-side configuration
export const stackConfig = {
  projectId: import.meta.env.VITE_STACK_PROJECT_ID,
  publishableClientKey: import.meta.env.VITE_STACK_PUBLISHABLE_CLIENT_KEY,
  urls: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    afterSignIn: '/admin',
    afterSignUp: '/admin',
  },
};

// Auth state management
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
  isActive: boolean;
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
