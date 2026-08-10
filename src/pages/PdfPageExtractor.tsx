import { useState, useCallback } from 'react';
import { SEO } from '../components/SEO';
import { DropZone } from '../components/DropZone';
import { FilePreview } from '../components/FilePreview';
import { DownloadButton } from '../components/DownloadButton';
import { ErrorMessage } from '../components/ErrorMessage';
import { ProcessingState } from '../components/ProcessingState';
import { extractPdfPages, getPdfPageCount } from '../utils/pdfProcessing';
import { formatBytes, downloadBytes } from '../utils/fileHelpers';
import { SUPPORTED_PDF_TYPES } from '../utils/constants';
import { Shield, Scissors, RotateCcw } from 'lucide-react';

export function PdfPageExtractor() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = useCallback(async (files: File[]) => {
    const f = files[0];
    if (!SUPPORTED_PDF_TYPES.includes(f.type)) {
      setError('Please upload a PDF file.');
      return;
    }
    setFile(f);
    setResult(null);
    setError(null);
    try {
      const count = await getPdfPageCount(f);
      setPageCount(count);
      setSelectedPages([]);
    } catch {
      setError('Could not read PDF.');
    }
  }, []);

  const handleProcess = async () => {
    if (!file || selectedPages.length === 0) {
      setError('Please select at least one page.');
      return;
    }
    setProcessing(true);
    setError(null);
    try {
      const extracted = await extractPdfPages(file, selectedPages);
      setResult(extracted);
    } catch {
      setError('Something went wrong while extracting pages.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (result) {
      downloadBytes(result, 'extracted.pdf', 'application/pdf');
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setPageCount(0);
    setSelectedPages([]);
    setError(null);
  };

  const togglePage = (page: number) => {
    setSelectedPages(prev => 
      prev.includes(page) ? prev.filter(p => p !== page) : [...prev, page].sort((a, b) => a - b)
    );
  };

  return (
    <>
      <SEO title="Free PDF Page Extractor Online" description="Extract specific pages from a PDF online for free. Browser-based processing." path="/pdf-extract" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 mb-4">
            <Scissors className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">PDF Extract</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Extract specific pages from a PDF</p>
          <div className="mt-3 inline-flex items-center gap-1.5 privacy-badge">
            <Shield className="w-3.5 h-3.5" />
            <span>Your files are processed locally in your browser and are not uploaded.</span>
          </div>
        </div>

        {!file ? (
          <DropZone onFiles={handleFiles} accept="application/pdf" label="Drop your PDF here" sublabel="PDF up to 50MB" icon="pdf" />
        ) : (
          <div className="space-y-6 animate-fade-in">
            {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}
            <div className="flex items-center justify-between">
              <FilePreview file={file} onRemove={handleReset} />
            </div>
            {!result && !processing && (
              <div className="card p-6 space-y-4">
                <h2 className="font-semibold text-gray-900 dark:text-gray-100">Select Pages to Extract ({pageCount} total)</h2>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: pageCount }, (_, i) => i + 1).map(page => (
                    <button key={page} onClick={() => togglePage(page)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                        selectedPages.includes(page) ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}>
                      {page}
                    </button>
                  ))}
                </div>
                <button onClick={handleProcess} className="w-full btn-primary py-3">Extract Pages</button>
              </div>
            )}
            {processing && <ProcessingState message="Extracting pages..." />}
            {result && (
              <div className="card p-6 animate-slide-up">
                <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Extracted PDF Ready</h2>
                <div className="flex flex-col sm:flex-row gap-3">
                  <DownloadButton onDownload={handleDownload} size={result.length} label="Download Extracted PDF" />
                  <button onClick={handleReset} className="btn-secondary"><RotateCcw className="w-4 h-4" /> Extract Another</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
