/**
 * Admin Authentication Utility
 * Handles token-based authentication for admin access
 */

const ADMIN_TOKEN_KEY = 'admin_access_token';
const ADMIN_USER_KEY = 'admin_user';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

/**
 * Check if user has valid admin token
 */
export function isAuthenticated(): boolean {
  const token = getToken();
  return !!token;
}

/**
 * Get stored authentication token
 */
export function getToken(): string | null {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

/**
 * Store authentication token
 */
export function setToken(token: string): void {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

/**
 * Get stored user data
 */
export function getUser(): AdminUser | null {
  const userData = localStorage.getItem(ADMIN_USER_KEY);
  if (!userData) return null;
  
  try {
    return JSON.parse(userData);
  } catch (e) {
    return null;
  }
}

/**
 * Store user data
 */
export function setUser(user: AdminUser): void {
  localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
}

/**
 * Clear authentication data
 */
export function logout(): void {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_USER_KEY);
}

/**
 * Check if user has admin role
 */
export function isAdmin(): boolean {
  const user = getUser();
  return user?.role === 'admin';
}

/**
 * Authenticate with backend
 * For development: accepts username "vite" and password "vite"
 */
export async function login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  // Simple dev authentication - username: vite, password: vite
  if (email === 'vite' && password === 'vite') {
    const token = 'dev_token_' + Date.now();
    setToken(token);
    setUser({
      id: 'vite-user',
      email: 'vite@admin.local',
      name: 'Vite Admin',
      role: 'admin',
    });
    return { success: true };
  }

  // Try backend authentication as fallback
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      return { success: false, error: 'Invalid username or password' };
    }

    const data = await response.json();
    
    if (data.token && data.user) {
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    }

    return { success: false, error: 'Invalid response from server' };
  } catch (error) {
    console.error('Login error:', error);
    // If backend is not available, still allow vite login
    if (email === 'vite' && password === 'vite') {
      const token = 'dev_token_' + Date.now();
      setToken(token);
      setUser({
        id: 'vite-user',
        email: 'vite@admin.local',
        name: 'Vite Admin',
        role: 'admin',
      });
      return { success: true };
    }
    return { success: false, error: 'Backend not available. Use username: vite, password: vite' };
  }
}

/**
 * Verify token with backend
 */
export async function verifyToken(): Promise<boolean> {
  const token = getToken();
  if (!token) return false;

  try {
    const response = await fetch('/api/auth/verify', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      logout();
      return false;
    }

    return true;
  } catch (error) {
    console.error('Token verification error:', error);
    return false;
  }
}

/**
 * Quick admin access with token
 * For development or quick access scenarios
 */
export function quickAccess(token: string): void {
  setToken(token);
  // In production, you'd verify the token first
  // For now, we'll set a basic user
  setUser({
    id: 'quick-access',
    email: 'admin@jpstas.com',
    name: 'Admin',
    role: 'admin',
  });
}

