import { SEO } from '../components/SEO';
import { Shield, Zap, Heart, Code } from 'lucide-react';

export function About() {
  return (
    <>
      <SEO
        title="About FileForge"
        description="Learn about FileForge, a free online file utility platform that processes all files locally in your browser."
        path="/about"
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">About FileForge</h1>

        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            FileForge is a free, open-minded online file utility platform designed with one core principle: 
            <strong> your privacy comes first</strong>. Every tool we offer runs entirely in your web browser, 
            meaning your files are never uploaded to any server.
          </p>

          <div className="my-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Shield className="w-6 h-6 text-primary-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Privacy First</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">All processing happens client-side. We never see your files.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Zap className="w-6 h-6 text-primary-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Fast & Free</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">No registration, no watermarks, no limits.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Code className="w-6 h-6 text-primary-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Modern Tech</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Built with React, TypeScript, and modern web APIs.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Heart className="w-6 h-6 text-primary-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Made with Care</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Designed for accessibility and performance.</p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">How It Works</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            When you use any FileForge tool, your file is loaded directly into your browser's memory. 
            All transformations — whether compressing an image, merging PDFs, or converting formats — 
            are performed using modern Web APIs like the Canvas API and WebAssembly-powered libraries. 
            Once processing is complete, the result is offered as a download, and all temporary data is 
            automatically cleared.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Browser Compatibility</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            FileForge works best in modern browsers including Chrome, Firefox, Safari, and Edge. 
            All tools are responsive and optimized for mobile devices. For the best experience with 
            PDF tools, we recommend using a desktop browser.
          </p>
        </div>
      </div>
    </>
  );
}
