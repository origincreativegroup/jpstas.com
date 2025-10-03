
export const onRequestPost: PagesFunction = async (context) => {
  const formData = await context.request.formData();
  const name = formData.get('name');
  const email = formData.get('email');
  const message = formData.get('message');

  // TODO: wire this into Email (SendGrid/Mailchannels) or a webhook (Discord/Slack)
  console.log('Contact message:', { name, email, message });

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' }
  });
};
