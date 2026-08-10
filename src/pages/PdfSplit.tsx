import { useState, useCallback } from 'react';
import { SEO } from '../components/SEO';
import { DropZone } from '../components/DropZone';
import { FilePreview } from '../components/FilePreview';
import { DownloadButton } from '../components/DownloadButton';
import { ErrorMessage } from '../components/ErrorMessage';
import { ProcessingState } from '../components/ProcessingState';
import { splitPdf } from '../utils/pdfProcessing';
import { formatBytes, downloadBlob, downloadBytes } from '../utils/fileHelpers';
import { SUPPORTED_PDF_TYPES } from '../utils/constants';
import { Shield, Split, RotateCcw } from 'lucide-react';
import JSZip from 'jszip';

export function PdfSplit() {
  const [file, setFile] = useState<File | null>(null);
  const [range, setRange] = useState('1-2');
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<Uint8Array[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = useCallback((files: File[]) => {
    const f = files[0];
    if (!SUPPORTED_PDF_TYPES.includes(f.type)) {
      setError('Please upload a PDF file.');
      return;
    }
    setFile(f);
    setResults([]);
    setError(null);
  }, []);

  const handleProcess = async () => {
    if (!file) return;
    setProcessing(true);
    setError(null);
    try {
      const split = await splitPdf(file, range);
      setResults(split);
    } catch {
      setError('Invalid page range or corrupted PDF. Use format like "1-3,5,7-9".');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownloadAll = async () => {
    if (results.length === 0) return;
    if (results.length === 1) {
      downloadBytes(results[0], 'split.pdf', 'application/pdf');
      return;
    }
    const zip = new JSZip();
    results.forEach((bytes, i) => zip.file(`part-${i + 1}.pdf`, bytes));
    const content = await zip.generateAsync({ type: 'blob' });
    downloadBlob(content, 'split-pdfs.zip');
  };

  const handleReset = () => {
    setFile(null);
    setResults([]);
    setError(null);
  };

  return (
    <>
      <SEO title="Free PDF Split Online – Extract Pages" description="Split PDFs by page ranges online for free. Browser-based processing with no uploads." path="/pdf-split" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 mb-4">
            <Split className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">PDF Split</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Split PDF by page ranges</p>
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
            {!results.length && !processing && (
              <div className="card p-6 space-y-4">
                <h2 className="font-semibold text-gray-900 dark:text-gray-100">Page Range</h2>
                <input
                  type="text"
                  value={range}
                  onChange={(e) => setRange(e.target.value)}
                  placeholder="e.g. 1-3,5,7-9"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                />
                <p className="text-xs text-gray-500">Use commas for separate ranges, dashes for continuous pages.</p>
                <button onClick={handleProcess} className="w-full btn-primary py-3">Split PDF</button>
              </div>
            )}
            {processing && <ProcessingState message="Splitting PDF..." />}
            {results.length > 0 && (
              <div className="card p-6 animate-slide-up">
                <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">{results.length} PDF(s) created</h2>
                <DownloadButton onDownload={handleDownloadAll} label={results.length === 1 ? 'Download PDF' : 'Download All as ZIP'} />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
