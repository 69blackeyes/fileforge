import { useState, useCallback } from 'react';
import { SEO } from '../components/SEO';
import { DropZone } from '../components/DropZone';
import { DownloadButton } from '../components/DownloadButton';
import { ErrorMessage } from '../components/ErrorMessage';
import { ProcessingState } from '../components/ProcessingState';
import { createPdfFromImages } from '../utils/pdfProcessing';
import { downloadBlob } from '../utils/fileHelpers';
import { Shield, FileImage, RotateCcw } from 'lucide-react';

export function PngToPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = useCallback((newFiles: File[]) => {
    const valid = newFiles.filter(f => f.type === 'image/png');
    if (valid.length !== newFiles.length) {
      setError('Only PNG files are accepted for this tool.');
    }
    setFiles(prev => [...prev, ...valid]);
    setPreviewUrls(prev => [...prev, ...valid.map(f => URL.createObjectURL(f))]);
    setResult(null);
  }, []);

  const handleProcess = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    setError(null);
    try {
      const pdfBytes = await createPdfFromImages(files);
      setResult(pdfBytes);
    } catch {
      setError('Something went wrong while creating the PDF. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (result) {
      const blob = new Blob([result], { type: 'application/pdf' });
      downloadBlob(blob, 'converted.pdf');
    }
  };

  const handleReset = () => {
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setFiles([]);
    setPreviewUrls([]);
    setResult(null);
    setError(null);
  };

  return (
    <>
      <SEO
        title="Free PNG to PDF Converter Online"
        description="Convert PNG images to PDF online for free. Browser-based processing with no uploads."
        path="/png-to-pdf"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 mb-4">
            <FileImage className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">PNG to PDF</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Convert PNG images to PDF documents</p>
          <div className="mt-3 inline-flex items-center gap-1.5 privacy-badge">
            <Shield className="w-3.5 h-3.5" />
            <span>Your files are processed locally in your browser and are not uploaded.</span>
          </div>
        </div>

        <DropZone
          onFiles={handleFiles}
          accept="image/png"
          multiple
          label="Drop PNG images here"
          sublabel="Add multiple images"
          icon="image"
        />

        {files.length > 0 && (
          <div className="mt-6 space-y-6 animate-fade-in">
            {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900 dark:text-gray-100">Images ({files.length})</h2>
                <button onClick={handleReset} className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1">
                  <RotateCcw className="w-4 h-4" />
                  Clear all
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {files.map((file, i) => (
                  <div key={i} className="relative">
                    <img src={previewUrls[i]} alt="" className="w-full h-24 object-cover rounded-lg" />
                    <p className="text-xs text-gray-500 mt-1 truncate">{file.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {!result && !processing && (
              <button onClick={handleProcess} className="w-full btn-primary py-3">
                Create PDF
              </button>
            )}

            {processing && <ProcessingState message="Creating PDF..." />}

            {result && (
              <div className="card p-6 animate-slide-up">
                <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">PDF Ready</h2>
                <DownloadButton onDownload={handleDownload} size={result.length} label="Download PDF" />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
