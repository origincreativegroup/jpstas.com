// Contact form handler for Cloudflare Pages
// Uses Cloudflare Email Workers to send emails
import { EmailMessage } from "cloudflare:email";

interface Env {
  CONTACT_EMAIL?: {
    send(message: EmailMessage): Promise<void>;
  };
}

export const onRequestPost = async ({ request, env }: { request: Request; env?: Env; context?: any }) => {
  try {
    // Ensure we have a request object
    if (!request) {
      return new Response(
        JSON.stringify({ error: 'Invalid request' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: 'All fields are required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Send email using Cloudflare Email Workers
    if (env?.CONTACT_EMAIL) {
      // Create email content
      const emailBody = `
New Contact Form Submission

From: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
This message was sent from the contact form on jpstas.com
      `.trim();

      const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #b98f45 0%, #454529 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
    .field { margin-bottom: 15px; }
    .label { font-weight: 600; color: #b98f45; }
    .value { margin-top: 5px; }
    .message-box { background: white; padding: 15px; border-left: 4px solid #b98f45; margin-top: 10px; }
    .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2 style="margin: 0;">New Contact Form Submission</h2>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">From:</div>
        <div class="value">${name}</div>
      </div>
      <div class="field">
        <div class="label">Email:</div>
        <div class="value"><a href="mailto:${email}">${email}</a></div>
      </div>
      <div class="field">
        <div class="label">Subject:</div>
        <div class="value">${subject}</div>
      </div>
      <div class="field">
        <div class="label">Message:</div>
        <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
      </div>
      <div class="footer">
        This message was sent from the contact form on <a href="https://jpstas.com">jpstas.com</a>
      </div>
    </div>
  </div>
</body>
</html>
      `;

      // Create MIME message manually (since we can't use external packages in Pages Functions)
      const mimeMessage = [
        `From: ${name} <info@jpstas.com>`,
        `To: johnpstas@gmail.com`,
        `Reply-To: ${email}`,
        `Subject: ${subject}`,
        `MIME-Version: 1.0`,
        `Content-Type: multipart/alternative; boundary="boundary123"`,
        ``,
        `--boundary123`,
        `Content-Type: text/plain; charset=UTF-8`,
        `Content-Transfer-Encoding: 7bit`,
        ``,
        emailBody,
        ``,
        `--boundary123`,
        `Content-Type: text/html; charset=UTF-8`,
        `Content-Transfer-Encoding: 7bit`,
        ``,
        htmlBody,
        ``,
        `--boundary123--`,
      ].join('\r\n');

      // Create EmailMessage
      const emailMessage = new EmailMessage(
        'info@jpstas.com', // from
        'johnpstas@gmail.com', // to
        mimeMessage
      );

      // Send email
      await env.CONTACT_EMAIL.send(emailMessage);

      console.log('Contact form email sent successfully:', {
        name,
        email,
        subject,
        messageLength: message.length,
      });
    } else {
      // Fallback: log if email binding is not configured
      console.warn('CONTACT_EMAIL binding not configured. Email not sent.');
      console.log('Contact form submission (not sent):', {
        name,
        email,
        subject,
        messageLength: message.length,
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Thank you for your message! I will get back to you soon.',
      }),
      {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send message',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

// Handle CORS preflight
export const onRequestOptions = async ({ request }: { request: Request }) => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};

