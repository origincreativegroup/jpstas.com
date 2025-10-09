import { component$, useSignal } from '@builder.io/qwik';
import { type DocumentHead } from '@builder.io/qwik-city';

export default component$(() => {
  const submitted = useSignal(false);
  
  return (
    <div class="py-16">
      <div class="max-w-4xl mx-auto px-6">
        {/* Header */}
        <section class="text-center mb-12">
          <h1 class="text-5xl font-bold mb-6">Let's Connect</h1>
          <p class="text-xl text-gray-600">
            Have a project in mind? Let's discuss how we can work together.
          </p>
        </section>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 class="text-2xl font-bold mb-6">Get In Touch</h2>
            
            <div class="space-y-6">
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span class="text-2xl">📧</span>
                </div>
                <div>
                  <h3 class="font-semibold mb-1">Email</h3>
                  <a href="mailto:john@jpstas.com" class="text-blue-600 hover:text-blue-700">
                    john@jpstas.com
                  </a>
                </div>
              </div>
              
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span class="text-2xl">💼</span>
                </div>
                <div>
                  <h3 class="font-semibold mb-1">LinkedIn</h3>
                  <a 
                    href="https://linkedin.com/in/johnpstas" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="text-blue-600 hover:text-blue-700"
                  >
                    /in/johnpstas
                  </a>
                </div>
              </div>
              
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span class="text-2xl">💻</span>
                </div>
                <div>
                  <h3 class="font-semibold mb-1">GitHub</h3>
                  <a 
                    href="https://github.com/johnpstas" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="text-blue-600 hover:text-blue-700"
                  >
                    @johnpstas
                  </a>
                </div>
              </div>
            </div>

            <div class="mt-12 p-6 bg-blue-50 rounded-xl">
              <h3 class="font-bold mb-2">Response Time</h3>
              <p class="text-gray-700">
                I typically respond within 24-48 hours. For urgent inquiries, 
                please indicate "URGENT" in the subject line.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            {submitted.value ? (
              <div class="bg-green-50 border-2 border-green-200 rounded-xl p-8 text-center">
                <div class="text-5xl mb-4">✅</div>
                <h3 class="text-2xl font-bold mb-2 text-green-800">Message Sent!</h3>
                <p class="text-green-700">
                  Thank you for reaching out. I'll get back to you soon.
                </p>
              </div>
            ) : (
              <form
                preventdefault:submit
                onSubmit$={async (event) => {
                  // Handle form submission
                  // For now, just show success message
                  submitted.value = true;
                }}
                class="space-y-6"
              >
                <div>
                  <label for="name" class="block font-medium mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label for="email" class="block font-medium mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label for="subject" class="block font-medium mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label for="message" class="block font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                    placeholder="Tell me about your project..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  class="w-full px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Contact - John P. Stas',
  meta: [
    {
      name: 'description',
      content: 'Get in touch with John P. Stas to discuss your next project or opportunity.',
    },
  ],
};

