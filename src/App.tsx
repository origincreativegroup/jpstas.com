import { Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-accent/20 bg-brand/95">
        <div className="max-w-6xl mx-auto px-4 py-10 text-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white">
            &copy; {new Date().getFullYear()} John P. Stas. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a
              className="text-white hover:text-accent transition-colors"
              href="mailto:johnpstas@gmail.com"
            >
              Email
            </a>
            <a
              className="text-white hover:text-accent transition-colors"
              href="https://www.linkedin.com/in/johnpstas"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <a
              className="text-white hover:text-accent transition-colors"
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
