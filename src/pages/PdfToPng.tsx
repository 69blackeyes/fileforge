import { useState, useCallback } from 'react';
import { SEO } from '../components/SEO';
import { DropZone } from '../components/DropZone';
import { FilePreview } from '../components/FilePreview';
import { DownloadButton } from '../components/DownloadButton';
import { ErrorMessage } from '../components/ErrorMessage';
import { ProcessingState } from '../components/ProcessingState';
import { formatBytes, downloadBlob } from '../utils/fileHelpers';
import { SUPPORTED_PDF_TYPES } from '../utils/constants';
import { Shield, FileText, RotateCcw } from 'lucide-react';
import JSZip from 'jszip';

export function PdfToPng() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [resultUrls, setResultUrls] = useState<string[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = useCallback(async (files: File[]) => {
    const f = files[0];
    if (!SUPPORTED_PDF_TYPES.includes(f.type)) {
      setError('Please upload a PDF file.');
      return;
    }
    setFile(f);
    setResultUrls([]);
    setError(null);
    try {
      const { getPdfPageCount } = await import('../utils/pdfProcessing');
      const count = await getPdfPageCount(f);
      setPageCount(count);
      setSelectedPages(Array.from({ length: count }, (_, i) => i + 1));
    } catch {
      setError('Could not read PDF.');
    }
  }, []);

  const handleProcess = async () => {
    if (!file || selectedPages.length === 0) return;
    setProcessing(true);
    setError(null);
    try {
      const pdfjs = await import('pdfjs-dist');
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

      const bytes = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: bytes }).promise;
      const urls: string[] = [];

      for (const pageNum of selectedPages) {
        const page = await pdf.getPage(pageNum);
        const scale = 2;
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) continue;
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: ctx, viewport }).promise;
        const blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), 'image/png'));
        urls.push(URL.createObjectURL(blob));
      }

      setResultUrls(urls);
    } catch {
      setError('Something went wrong while converting this PDF.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownloadAll = async () => {
    if (resultUrls.length === 0) return;
    if (resultUrls.length === 1) {
      const a = document.createElement('a');
      a.href = resultUrls[0];
      a.download = `page-1.png`;
      a.click();
      return;
    }
    const zip = new JSZip();
    for (let i = 0; i < resultUrls.length; i++) {
      const res = await fetch(resultUrls[i]);
      const blob = await res.blob();
      zip.file(`page-${selectedPages[i]}.png`, blob);
    }
    const content = await zip.generateAsync({ type: 'blob' });
    downloadBlob(content, 'pdf-pages.zip');
  };

  const handleReset = () => {
    resultUrls.forEach(url => URL.revokeObjectURL(url));
    setFile(null);
    setResultUrls([]);
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
      <SEO
        title="Free PDF to PNG Converter Online"
        description="Convert PDF pages to PNG images online for free. Browser-based processing with no uploads."
        path="/pdf-to-png"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 mb-4">
            <FileText className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">PDF to PNG</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Convert PDF pages to PNG images</p>
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
            {!resultUrls.length && !processing && (
              <div className="card p-6 space-y-4">
                <h2 className="font-semibold text-gray-900 dark:text-gray-100">Select Pages ({pageCount} total)</h2>
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
                <button onClick={handleProcess} className="w-full btn-primary py-3">Convert Selected Pages</button>
              </div>
            )}
            {processing && <ProcessingState message="Converting PDF to PNG..." />}
            {resultUrls.length > 0 && (
              <div className="card p-6 animate-slide-up">
                <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Result ({resultUrls.length} images)</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                  {resultUrls.map((url, i) => (
                    <div key={i} className="relative">
                      <img src={url} alt={`Page ${selectedPages[i]}`} className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700" />
                      <span className="absolute top-2 left-2 px-2 py-1 bg-black/60 text-white text-xs rounded">Page {selectedPages[i]}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <DownloadButton onDownload={handleDownloadAll} label={resultUrls.length === 1 ? 'Download PNG' : 'Download All as ZIP'} />
                  <button onClick={handleReset} className="btn-secondary"><RotateCcw className="w-4 h-4" /> Convert Another</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
