import { SEO } from '../components/SEO';

export function Privacy() {
  return (
    <>
      <SEO
        title="Privacy Policy"
        description="FileForge privacy policy. We process all files locally in your browser and never upload them to any server."
        path="/privacy"
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">Privacy Policy</h1>

        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-600 dark:text-gray-400">
            At FileForge, privacy is not just a feature — it is the foundation of our service. 
            This policy explains how we handle your data.
          </p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Local Processing</h2>
          <p className="text-gray-600 dark:text-gray-400">
            <strong>All file processing happens entirely within your web browser.</strong> When you upload 
            a file to any of our tools, it is loaded into your browser's memory and processed using 
            client-side technologies. Your files are never transmitted to our servers or any third-party 
            services.
          </p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Data We Do Not Collect</h2>
          <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400 space-y-2">
            <li>We do not collect, store, or process your uploaded files.</li>
            <li>We do not track the content of your files.</li>
            <li>We do not require account registration.</li>
            <li>We do not use cookies for tracking purposes.</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Data We May Collect</h2>
          <p className="text-gray-600 dark:text-gray-400">
            We may collect anonymous usage statistics (such as page views and tool popularity) to help 
            us improve our service. This data is aggregated and cannot be used to identify individual users 
            or the content of their files.
          </p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Third-Party Services</h2>
          <p className="text-gray-600 dark:text-gray-400">
            We do not use third-party analytics or advertising services that track you across the web. 
            Any external libraries loaded are open-source and used solely for file processing functionality.
          </p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Changes to This Policy</h2>
          <p className="text-gray-600 dark:text-gray-400">
            We may update this privacy policy from time to time. Any changes will be posted on this page 
            with an updated effective date.
          </p>

          <p className="text-gray-500 dark:text-gray-500 text-sm mt-8">
            Last updated: August 2026
          </p>
        </div>
      </div>
    </>
  );
}
