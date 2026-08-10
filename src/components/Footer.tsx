import { Link } from 'react-router-dom';
import { Hammer, Github, Twitter, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary-600 dark:text-primary-400 mb-4">
              <Hammer className="w-6 h-6" />
              <span>FileForge</span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm max-w-md">
              Free online tools for images and PDFs. All processing happens in your browser — 
              your files never leave your device.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Tools</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/image-compressor" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">Image Compressor</Link></li>
              <li><Link to="/image-cropper" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">Image Cropper</Link></li>
              <li><Link to="/pdf-merge" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">PDF Merge</Link></li>
              <li><Link to="/pdf-split" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">PDF Split</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">About</Link></li>
              <li><Link to="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">Privacy</Link></li>
              <li><Link to="/terms" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-500">
            © 2026 FileForge. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for privacy
          </p>
        </div>
      </div>
    </footer>
  );
}
