import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { ToolCard } from '../components/ToolCard';
import { TOOLS } from '../utils/constants';
import { Shield, Zap, Smartphone, Lock, Sparkles, ArrowRight, Minimize2, Crop, Maximize2, RefreshCw, FileImage, FileText, Merge, Split } from 'lucide-react';

const popularTools = TOOLS.slice(0, 8);

const features = [
  { icon: Shield, title: 'Privacy First', description: 'All processing happens in your browser. Files never leave your device.' },
  { icon: Zap, title: 'Fast & Free', description: 'No registration required. Process files instantly without waiting.' },
  { icon: Smartphone, title: 'Mobile Friendly', description: 'Works perfectly on phones, tablets, and desktops.' },
  { icon: Lock, title: 'No Uploads', description: 'Your files are processed locally. We never see your data.' },
];

export function Home() {
  return (
    <>
      <SEO
        title="FileForge - Free Online Image & PDF Tools"
        description="Free online tools to compress, crop, resize, convert and manage your images and PDFs directly in your browser. No uploads, no registration."
        path="/"
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 to-white dark:from-gray-900 dark:to-gray-950 py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            <span>100% Free & Browser-Based</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white tracking-tight">
            Free Online Image & <span className="text-primary-600 dark:text-primary-400">PDF Tools</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Compress, crop, resize, convert and manage your files directly in your browser. 
            No uploads, no registration, no limits.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/tools" className="btn-primary text-lg px-8 py-4">
              Explore All Tools
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/image-compressor" className="btn-secondary text-lg px-8 py-4">
              <Minimize2 className="w-5 h-5" />
              Compress an Image
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-green-600 dark:text-green-400">
            <Shield className="w-4 h-4" />
            <span>Your files are processed locally in your browser and are not uploaded.</span>
          </div>
        </div>
      </section>

      {/* Popular Tools */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Popular Tools</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Most used utilities by our community</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularTools.map(tool => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/tools" className="btn-secondary">
              View All {TOOLS.length} Tools
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Why FileForge?</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Built with privacy and performance in mind</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map(feature => (
              <div key={feature.title} className="text-center p-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mb-4">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{feature.title}</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Tool Categories</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-8 text-center hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
                <FileImage className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Image Tools</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Compress, crop, resize, convert, rotate, and more.</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <Link to="/image-compressor" className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors">Compressor</Link>
                <Link to="/image-cropper" className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors">Cropper</Link>
                <Link to="/image-resizer" className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors">Resizer</Link>
                <Link to="/image-converter" className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors">Converter</Link>
              </div>
            </div>

            <div className="card p-8 text-center hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">PDF Tools</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Merge, split, compress, convert, and manipulate PDFs.</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <Link to="/pdf-merge" className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors">Merge</Link>
                <Link to="/pdf-split" className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors">Split</Link>
                <Link to="/pdf-compressor" className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors">Compress</Link>
                <Link to="/pdf-to-jpg" className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors">To JPG</Link>
              </div>
            </div>

            <div className="card p-8 text-center hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-4">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Privacy First</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">All tools run in your browser. No server uploads.</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <Link to="/image-metadata" className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors">Metadata Remover</Link>
                <Link to="/privacy" className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors">Privacy Policy</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-primary-600 dark:bg-primary-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Ready to process your files?</h2>
          <p className="mt-4 text-primary-100 text-lg">
            Start using our free tools right now. No account needed.
          </p>
          <Link to="/tools" className="mt-8 inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-700 font-semibold rounded-lg hover:bg-primary-50 transition-colors">
            Get Started
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
