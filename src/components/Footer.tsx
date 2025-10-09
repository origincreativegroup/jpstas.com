import { component$ } from '@builder.io/qwik';

export default component$(() => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer class="bg-gray-900 text-white py-12">
      <div class="max-w-6xl mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 class="text-xl font-bold mb-4">John P. Stas</h3>
            <p class="text-gray-400">
              Creative Technologist, Designer & Process Innovator
            </p>
          </div>
          
          <div>
            <h4 class="text-lg font-semibold mb-4">Quick Links</h4>
            <ul class="space-y-2">
              <li>
                <a href="/about" class="text-gray-400 hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="/portfolio" class="text-gray-400 hover:text-white transition-colors">
                  Portfolio
                </a>
              </li>
              <li>
                <a href="/resume" class="text-gray-400 hover:text-white transition-colors">
                  Resume
                </a>
              </li>
              <li>
                <a href="/contact" class="text-gray-400 hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 class="text-lg font-semibold mb-4">Connect</h4>
            <ul class="space-y-2">
              <li>
                <a 
                  href="https://linkedin.com/in/johnpstas" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="text-gray-400 hover:text-white transition-colors"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/johnpstas" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="text-gray-400 hover:text-white transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a 
                  href="mailto:john@jpstas.com" 
                  class="text-gray-400 hover:text-white transition-colors"
                >
                  Email
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div class="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {currentYear} John P. Stas. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
});

