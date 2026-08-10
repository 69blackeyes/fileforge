import { useState, useCallback } from 'react';
import { SEO } from '../components/SEO';
import { DropZone } from '../components/DropZone';
import { FilePreview } from '../components/FilePreview';
import { DownloadButton } from '../components/DownloadButton';
import { ErrorMessage } from '../components/ErrorMessage';
import { ProcessingState } from '../components/ProcessingState';
import { rotatePdf } from '../utils/pdfProcessing';
import { formatBytes, downloadBlob } from '../utils/fileHelpers';
import { SUPPORTED_PDF_TYPES } from '../utils/constants';
import { Shield, RotateCw, RotateCcw, RotateCcw as RotateLeft, RotateCw as RotateRight } from 'lucide-react';

export function PdfPageRotator() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = useCallback((files: File[]) => {
    const f = files[0];
    if (!SUPPORTED_PDF_TYPES.includes(f.type)) {
      setError('Please upload a PDF file.');
      return;
    }
    setFile(f);
    setResult(null);
    setError(null);
  }, []);

  const handleRotate = async (degrees: number) => {
    if (!file) return;
    setProcessing(true);
    setError(null);
    try {
      const rotated = await rotatePdf(file, degrees);
      setResult(rotated);
    } catch {
      setError('Something went wrong while rotating this PDF.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (result) {
      downloadBlob(new Blob([result], { type: 'application/pdf' }), 'rotated.pdf');
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setError(null);
  };

  return (
    <>
      <SEO title="Free PDF Rotator Online – Rotate Pages" description="Rotate PDF pages online for free. Browser-based processing with no uploads." path="/pdf-rotate" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 mb-4">
            <RotateCw className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">PDF Rotate</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Rotate all pages in a PDF</p>
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
              <div className="card p-6">
                <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Rotate</h2>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => handleRotate(90)} className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all text-center">
                    <RotateCw className="w-8 h-8 mx-auto mb-2 text-primary-600" />
                    <span className="font-medium">90° Right</span>
                  </button>
                  <button onClick={() => handleRotate(-90)} className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all text-center">
                    <RotateCcw className="w-8 h-8 mx-auto mb-2 text-primary-600" />
                    <span className="font-medium">90° Left</span>
                  </button>
                  <button onClick={() => handleRotate(180)} className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all text-center">
                    <RotateCw className="w-8 h-8 mx-auto mb-2 text-primary-600" />
                    <span className="font-medium">180°</span>
                  </button>
                  <button onClick={() => handleRotate(270)} className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all text-center">
                    <RotateCcw className="w-8 h-8 mx-auto mb-2 text-primary-600" />
                    <span className="font-medium">270°</span>
                  </button>
                </div>
              </div>
            )}
            {processing && <ProcessingState message="Rotating PDF..." />}
            {result && (
              <div className="card p-6 animate-slide-up">
                <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Rotated PDF Ready</h2>
                <div className="flex flex-col sm:flex-row gap-3">
                  <DownloadButton onDownload={handleDownload} size={result.length} label="Download Rotated PDF" />
                  <button onClick={handleReset} className="btn-secondary"><RotateCcw className="w-4 h-4" /> Rotate Another</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
