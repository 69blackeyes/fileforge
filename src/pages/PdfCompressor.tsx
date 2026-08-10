import { useState, useCallback } from 'react';
import { SEO } from '../components/SEO';
import { DropZone } from '../components/DropZone';
import { FilePreview } from '../components/FilePreview';
import { DownloadButton } from '../components/DownloadButton';
import { ErrorMessage } from '../components/ErrorMessage';
import { ProcessingState } from '../components/ProcessingState';
import { formatBytes, getReductionPercent, downloadBytes } from '../utils/fileHelpers';
import { SUPPORTED_PDF_TYPES } from '../utils/constants';
import { Shield, FileDown, RotateCcw } from 'lucide-react';

export function PdfCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');

  const handleFiles = useCallback((files: File[]) => {
    const f = files[0];
    if (!SUPPORTED_PDF_TYPES.includes(f.type)) {
      setError('Please upload a PDF file.');
      return;
    }
    setFile(f);
    setResult(null);
    setError(null);
    setMessage('');
  }, []);

  const handleProcess = async () => {
    if (!file) return;
    setProcessing(true);
    setError(null);
    setMessage('');

    try {
      const { PDFDocument } = await import('pdf-lib');
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);

      // Basic optimization: remove unused objects and compress streams
      const optimized = await pdf.save({
        useObjectStreams: true,
        addDefaultPage: false,
      });

      setResult(optimized);

      if (optimized.length >= file.size) {
        setMessage('This PDF is already well-optimized and could not be further compressed. The file size may remain similar or slightly increase due to re-saving.');
      }
    } catch {
      setError('Something went wrong while processing this PDF. It may be corrupted or password-protected.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (result) {
      downloadBytes(result, 'compressed.pdf', 'application/pdf');
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setError(null);
    setMessage('');
  };

  return (
    <>
      <SEO
        title="Free PDF Compressor Online – Reduce PDF File Size"
        description="Compress PDF files online for free. Reduce file size where technically possible. Browser-based processing with no uploads."
        path="/pdf-compressor"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 mb-4">
            <FileDown className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">PDF Compressor</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Reduce PDF file size where possible</p>
          <div className="mt-3 inline-flex items-center gap-1.5 privacy-badge">
            <Shield className="w-3.5 h-3.5" />
            <span>Your files are processed locally in your browser and are not uploaded.</span>
          </div>
        </div>

        {!file ? (
          <DropZone
            onFiles={handleFiles}
            accept="application/pdf"
            label="Drop your PDF here"
            sublabel="PDF up to 50MB"
            icon="pdf"
          />
        ) : (
          <div className="space-y-6 animate-fade-in">
            {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

            <div className="flex items-center justify-between">
              <FilePreview file={file} onRemove={handleReset} />
            </div>

            {!result && !processing && (
              <div className="card p-6 space-y-4">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <p className="text-sm text-yellow-800 dark:text-yellow-300">
                    <strong>Note:</strong> PDF compression depends on the content. PDFs with mostly text 
                    may not compress further. Image-heavy PDFs may see better results. We never guarantee 
                    a specific reduction percentage.
                  </p>
                </div>
                <button onClick={handleProcess} className="w-full btn-primary py-3">
                  Compress PDF
                </button>
              </div>
            )}

            {processing && <ProcessingState message="Compressing PDF..." />}

            {result && file && (
              <div className="card p-6 animate-slide-up">
                <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Result</h2>
                {message && (
                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-sm text-blue-700 dark:text-blue-300">{message}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-500">Original</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{formatBytes(file.size)}</p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm text-gray-500">Compressed</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {formatBytes(result.length)}
                      {result.length < file.size && (
                        <span className="text-green-600 dark:text-green-400 text-sm ml-2">
                          -{getReductionPercent(file.size, result.length)}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <DownloadButton onDownload={handleDownload} size={result.length} label="Download Compressed PDF" />
                  <button onClick={handleReset} className="btn-secondary">
                    <RotateCcw className="w-4 h-4" />
                    Compress Another
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
