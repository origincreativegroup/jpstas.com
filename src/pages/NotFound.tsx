import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';

export default function NotFound() {
  return (
    <>
      <Navigation />
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-brand mb-4">404</h1>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Page Not Found</h2>
            <p className="text-gray-600">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="space-y-4">
            <Link
              to="/"
              className="inline-block w-full px-6 py-3 bg-brand text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Go Home
            </Link>

            <div className="text-sm text-gray-500">Or try one of these pages:</div>

            <div className="flex flex-wrap gap-2 justify-center">
              <Link
                to="/portfolio"
                className="px-4 py-2 text-sm border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                Portfolio
              </Link>
              <Link
                to="/about"
                className="px-4 py-2 text-sm border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                About
              </Link>
              <Link
                to="/workshop/contact"
                className="px-4 py-2 text-sm border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
