import { SEO } from '../components/SEO';

export function Terms() {
  return (
    <>
      <SEO
        title="Terms of Service"
        description="FileForge terms of service. Free browser-based file processing tools with no warranties."
        path="/terms"
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">Terms of Service</h1>

        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-600 dark:text-gray-400">
            By using FileForge, you agree to these terms. Please read them carefully.
          </p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">1. Service Description</h2>
          <p className="text-gray-600 dark:text-gray-400">
            FileForge provides free online file processing tools that operate entirely within your web browser. 
            All file transformations are performed client-side using your device's computing resources.
          </p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">2. Acceptable Use</h2>
          <p className="text-gray-600 dark:text-gray-400">
            You agree to use FileForge only for lawful purposes. You may not use our tools to process 
            files that contain illegal content, malware, or material that infringes on intellectual property rights.
          </p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">3. No Warranty</h2>
          <p className="text-gray-600 dark:text-gray-400">
            FileForge is provided "as is" without any warranties, express or implied. We do not guarantee 
            that our tools will meet your requirements, be error-free, or produce specific results. You use 
            our service at your own risk.
          </p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">4. Limitation of Liability</h2>
          <p className="text-gray-600 dark:text-gray-400">
            To the maximum extent permitted by law, FileForge shall not be liable for any direct, indirect, 
            incidental, or consequential damages arising from your use of our service.
          </p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">5. Changes to Terms</h2>
          <p className="text-gray-600 dark:text-gray-400">
            We reserve the right to modify these terms at any time. Continued use of FileForge after changes 
            constitutes acceptance of the updated terms.
          </p>

          <p className="text-gray-500 dark:text-gray-500 text-sm mt-8">
            Last updated: August 2026
          </p>
        </div>
      </div>
    </>
  );
}
