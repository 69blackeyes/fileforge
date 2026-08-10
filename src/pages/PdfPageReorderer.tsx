import { useState, useCallback } from 'react';
import { SEO } from '../components/SEO';
import { DropZone } from '../components/DropZone';
import { FilePreview } from '../components/FilePreview';
import { DownloadButton } from '../components/DownloadButton';
import { ErrorMessage } from '../components/ErrorMessage';
import { ProcessingState } from '../components/ProcessingState';
import { reorderPdfPages, getPdfPageCount } from '../utils/pdfProcessing';
import { formatBytes, downloadBlob } from '../utils/fileHelpers';
import { SUPPORTED_PDF_TYPES } from '../utils/constants';
import { Shield, ArrowUpDown, RotateCcw, ArrowUp, ArrowDown } from 'lucide-react';

export function PdfPageReorderer() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [newOrder, setNewOrder] = useState<number[]>([]);
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
      setNewOrder(Array.from({ length: count }, (_, i) => i + 1));
    } catch {
      setError('Could not read PDF.');
    }
  }, []);

  const handleProcess = async () => {
    if (!file || newOrder.length === 0) return;
    setProcessing(true);
    setError(null);
    try {
      const reordered = await reorderPdfPages(file, newOrder);
      setResult(reordered);
    } catch {
      setError('Something went wrong while reordering pages.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (result) {
      downloadBlob(new Blob([result], { type: 'application/pdf' }), 'reordered.pdf');
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setPageCount(0);
    setNewOrder([]);
    setError(null);
  };

  const movePage = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === newOrder.length - 1) return;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const order = [...newOrder];
    [order[index], order[newIndex]] = [order[newIndex], order[index]];
    setNewOrder(order);
  };

  return (
    <>
      <SEO title="Free PDF Page Reorderer Online" description="Reorder pages in a PDF online for free. Browser-based processing." path="/pdf-reorder" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 mb-4">
            <ArrowUpDown className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">PDF Page Reorderer</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Change the order of pages in a PDF</p>
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
                <h2 className="font-semibold text-gray-900 dark:text-gray-100">Reorder Pages</h2>
                <div className="space-y-2">
                  {newOrder.map((page, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="w-8 h-8 flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-bold">{i + 1}</span>
                      <span className="flex-1 text-sm">Page {page}</span>
                      <div className="flex gap-1">
                        <button onClick={() => movePage(i, 'up')} disabled={i === 0} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"><ArrowUp className="w-4 h-4" /></button>
                        <button onClick={() => movePage(i, 'down')} disabled={i === newOrder.length - 1} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"><ArrowDown className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={handleProcess} className="w-full btn-primary py-3">Apply New Order</button>
              </div>
            )}
            {processing && <ProcessingState message="Reordering pages..." />}
            {result && (
              <div className="card p-6 animate-slide-up">
                <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Reordered PDF Ready</h2>
                <div className="flex flex-col sm:flex-row gap-3">
                  <DownloadButton onDownload={handleDownload} size={result.length} label="Download Reordered PDF" />
                  <button onClick={handleReset} className="btn-secondary"><RotateCcw className="w-4 h-4" /> Reorder Another</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
