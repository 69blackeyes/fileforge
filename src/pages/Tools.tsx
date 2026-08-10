import { SEO } from '../components/SEO';
import { ToolCard } from '../components/ToolCard';
import { TOOLS } from '../utils/constants';
import { Search } from 'lucide-react';
import { useState, useMemo } from 'react';

export function Tools() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');

  const filtered = useMemo(() => {
    return TOOLS.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(search.toLowerCase()) ||
        tool.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'all' || tool.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  const categories = [
    { id: 'all', label: 'All Tools' },
    { id: 'image', label: 'Image Tools' },
    { id: 'pdf', label: 'PDF Tools' },
  ];

  return (
    <>
      <SEO
        title="All Tools - Free Online Image & PDF Utilities"
        description="Browse all free online image and PDF tools. Compress, convert, merge, split, and more — all in your browser."
        path="/tools"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">All Tools</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {TOOLS.length} free browser-based utilities for your files
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tools..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
          <div className="flex gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  category === cat.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(tool => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No tools found matching your search.</p>
          </div>
        )}
      </div>
    </>
  );
}
