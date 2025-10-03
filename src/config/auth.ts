// Admin authentication configuration
// In production, these should be environment variables
export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'jpstas2024' // Change this to your desired password
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
