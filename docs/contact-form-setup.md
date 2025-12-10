# Contact Form Email Setup

This document explains how the contact form sends emails using Cloudflare Email Workers.

## Configuration

The contact form uses Cloudflare Email Workers to send emails when someone submits the form.

### Email Configuration

- **Sending Address**: `info@jpstas.com` (must be verified in Cloudflare Email Routing)
- **Receiving Address**: `johnpstas@gmail.com`
- **Domain**: `jpstas.com`

### Setup Steps

1. **Verify Email Routing is Enabled**
   - Go to Cloudflare Dashboard → Email → Email Routing
   - Ensure Email Routing is enabled for `jpstas.com`
   - Verify that `info@jpstas.com` is set up and verified

2. **Email Binding Configuration**
   - ✅ **Already configured in `wrangler.toml`**
   - The email binding is automatically managed through `wrangler.toml`:
     ```toml
     [[send_email]]
     name = "CONTACT_EMAIL"
     destination_address = "info@jpstas.com"
     ```
   - When you deploy, Cloudflare Pages will automatically pick up this configuration
   - You can verify it in: Dashboard → Pages → Your Project → Settings → Functions → Bindings

3. **Deploy**
   - The contact form function is located at `/functions/api/contact.ts`
   - Commit and push your changes
   - Cloudflare Pages will automatically deploy with the email binding
   - The binding will be available as `env.CONTACT_EMAIL` in your function

### How It Works

1. User submits the contact form
2. Form data is validated (name, email, subject, message)
3. An email is created using Cloudflare's `EmailMessage` API
4. Email is sent to `johnpstas@gmail.com` via the `CONTACT_EMAIL` binding
5. The email includes:
   - Plain text version
   - HTML version with styling
   - Reply-To set to the user's email address

### Email Format

The email includes:
- **From**: The user's name (via info@jpstas.com)
- **To**: johnpstas@gmail.com
- **Reply-To**: The user's email address
- **Subject**: The subject from the form
- **Body**: Both plain text and HTML versions of the message

### Troubleshooting

If emails are not being sent:

1. **Check Email Routing Status**
   - Verify Email Routing is enabled in Cloudflare Dashboard
   - Ensure `info@jpstas.com` is verified

2. **Check Email Binding in Dashboard**
   - Go to Pages → Settings → Functions → Bindings
   - Verify `CONTACT_EMAIL` binding appears (should be managed via `wrangler.toml`)
   - If it doesn't appear, check that `wrangler.toml` has the correct configuration
   - Note: The dashboard may show "Bindings are managed through wrangler.toml" - this is normal

3. **Check Cloudflare Logs**
   - Go to Pages → Your Project → Logs
   - Look for errors in the contact form function
   - Check for messages like "CONTACT_EMAIL binding not configured"

4. **Test the Function**
   - Submit a test form submission
   - Check the function logs for any errors
   - Verify the email binding is accessible (should see "Contact form email sent successfully" in logs)

### Notes

- The email binding must be configured in the Cloudflare Dashboard for Pages Functions
- The `wrangler.toml` configuration is for reference, but Pages Functions use dashboard configuration
- Emails are sent asynchronously - the form will return success even if email sending is queued
