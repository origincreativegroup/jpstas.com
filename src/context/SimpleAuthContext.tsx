import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
  isActive: boolean;
}

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface SimpleAuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, name: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  updateUser: (updates: Partial<AuthUser>) => Promise<void>;
}

const SimpleAuthContext = createContext<SimpleAuthContextType | undefined>(undefined);

interface SimpleAuthProviderProps {
  children: ReactNode;
}

export const SimpleAuthProvider: React.FC<SimpleAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // Check localStorage for existing session
        const storedUser = localStorage.getItem('auth_user');
        const storedToken = localStorage.getItem('auth_token');
        
        if (storedUser && storedToken) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // For now, use a simple hardcoded admin user
      // This can be replaced with actual Stack Auth integration later
      if (email === 'johnpstas@jpstas.com' && password === 'qidban-wyzcAr-6wawjo') {
        const authUser: AuthUser = {
          id: 'admin-001',
          email: email,
          name: 'John P Stas',
          role: 'admin',
          isActive: true,
        };
        
        // Store in localStorage
        localStorage.setItem('auth_user', JSON.stringify(authUser));
        localStorage.setItem('auth_token', 'mock-token-' + Date.now());
        
        setUser(authUser);
        setIsAuthenticated(true);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Sign in error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, _password: string, name: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // For now, create a simple user account
      const authUser: AuthUser = {
        id: 'user-' + Date.now(),
        email: email,
        name: name,
        role: 'user',
        isActive: true,
      };
      
      // Store in localStorage
      localStorage.setItem('auth_user', JSON.stringify(authUser));
      localStorage.setItem('auth_token', 'mock-token-' + Date.now());
      
      setUser(authUser);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Sign up error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_token');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const updateUser = async (updates: Partial<AuthUser>): Promise<void> => {
    try {
      if (!user) return;
      
      const updatedUser = { ...user, ...updates };
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Update user error:', error);
    }
  };

  const contextValue: SimpleAuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    updateUser,
  };

  return (
    <SimpleAuthContext.Provider value={contextValue}>
      {children}
    </SimpleAuthContext.Provider>
  );
};

export const useSimpleAuth = (): SimpleAuthContextType => {
  const context = useContext(SimpleAuthContext);
  if (context === undefined) {
    throw new Error('useSimpleAuth must be used within a SimpleAuthProvider');
  }
  return context;
};
