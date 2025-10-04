// Admin authentication configuration
export const ADMIN_CREDENTIALS = {
  username: import.meta.env.VITE_ADMIN_USERNAME || 'admin',
  password: import.meta.env.VITE_ADMIN_PASSWORD || 'admin123',
};

export const AUTH_TOKEN_KEY = 'admin_auth';

export const checkAuthStatus = (): boolean => {
  return localStorage.getItem(AUTH_TOKEN_KEY) === 'true';
};

export const setAuthenticated = (authenticated: boolean): void => {
  if (authenticated) {
    localStorage.setItem(AUTH_TOKEN_KEY, 'true');
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
};
