# Admin Authentication

## Accessing the Admin Panel

The admin panel is now password-protected and can be accessed at `/admin`.

## Default Credentials

- **Username**: `admin`
- **Password**: `jpstas2024`

## Security Notes

- The current implementation uses simple username/password authentication stored in localStorage
- For production use, consider implementing more secure authentication methods
- Credentials are stored in `src/config/auth.ts` - change the password there
- The authentication state persists across browser sessions until logout

## Features

- ✅ Login form with error handling
- ✅ Session persistence (stays logged in until logout)
- ✅ Logout functionality
- ✅ Protected admin routes
- ✅ Clean, professional login interface

## Changing the Password

To change the admin password, edit the `ADMIN_CREDENTIALS` object in `src/config/auth.ts`:

```typescript
export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'your-new-password-here'
};
```

## Logout

Users can logout by clicking the red "Logout" button in the admin interface, which will:
- Clear the authentication token
- Redirect to the login screen
- Reset all admin state
