# Analytics Environment Setup

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# Google Analytics Configuration
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Replace `G-XXXXXXXXXX` with your actual Google Analytics 4 Measurement ID.

## Development vs Production

- **Development**: Analytics will initialize but use mock data for testing
- **Production**: Analytics will connect to your real GA4 property

## Getting Your Measurement ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property for your website
3. Set up a web data stream
4. Copy the Measurement ID (format: `G-XXXXXXXXXX`)
5. Add it to your `.env.local` file

## Testing

To test analytics in development:

1. Open browser developer tools
2. Check the Console for analytics initialization messages
3. Use Google Analytics DebugView to see real-time events
4. Verify events are being tracked correctly

## Security

- Never commit your `.env.local` file to version control
- Keep your Measurement ID private
- Use environment variables for all sensitive configuration
