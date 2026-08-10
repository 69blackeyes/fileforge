import { useState, useCallback } from 'react';
import { SEO } from '../components/SEO';
import { DropZone } from '../components/DropZone';
import { DownloadButton } from '../components/DownloadButton';
import { ErrorMessage } from '../components/ErrorMessage';
import { ProcessingState } from '../components/ProcessingState';
import { mergePdfs } from '../utils/pdfProcessing';
import { formatBytes, downloadBytes } from '../utils/fileHelpers';
import { SUPPORTED_PDF_TYPES } from '../utils/constants';
import { Shield, Merge, RotateCcw, ArrowUp, ArrowDown, Trash2, FileText } from 'lucide-react';

export function PdfMerge() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = useCallback((newFiles: File[]) => {
    const valid = newFiles.filter(f => SUPPORTED_PDF_TYPES.includes(f.type));
    if (valid.length !== newFiles.length) setError('Only PDF files are accepted.');
    setFiles(prev => [...prev, ...valid]);
    setResult(null);
    setError(null);
  }, []);

  const handleProcess = async () => {
    if (files.length < 2) {
      setError('Please upload at least 2 PDFs to merge.');
      return;
    }
    setProcessing(true);
    setError(null);
    try {
      const merged = await mergePdfs(files);
      setResult(merged);
    } catch {
      setError('Something went wrong while merging PDFs. They may be corrupted or password-protected.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (result) {
      downloadBytes(result, 'merged.pdf', 'application/pdf');
    }
  };

  const handleReset = () => {
    setFiles([]);
    setResult(null);
    setError(null);
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === files.length - 1) return;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newFiles = [...files];
    [newFiles[index], newFiles[newIndex]] = [newFiles[newIndex], newFiles[index]];
    setFiles(newFiles);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <SEO title="Free PDF Merge Online – Combine PDFs" description="Merge multiple PDFs into one document online for free. Reorder pages. Browser-based processing." path="/pdf-merge" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 mb-4">
            <Merge className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">PDF Merge</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Combine multiple PDFs into one</p>
          <div className="mt-3 inline-flex items-center gap-1.5 privacy-badge">
            <Shield className="w-3.5 h-3.5" />
            <span>Your files are processed locally in your browser and are not uploaded.</span>
          </div>
        </div>

        <DropZone onFiles={handleFiles} accept="application/pdf" multiple label="Drop PDFs here" sublabel="Add multiple PDFs" icon="pdf" />

        {files.length > 0 && (
          <div className="mt-6 space-y-6 animate-fade-in">
            {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900 dark:text-gray-100">PDFs ({files.length})</h2>
                <button onClick={handleReset} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"><RotateCcw className="w-4 h-4" /> Clear all</button>
              </div>
              <div className="space-y-2">
                {files.map((file, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <FileText className="w-8 h-8 text-red-500" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatBytes(file.size)}</p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => moveFile(i, 'up')} disabled={i === 0} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"><ArrowUp className="w-4 h-4" /></button>
                      <button onClick={() => moveFile(i, 'down')} disabled={i === files.length - 1} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"><ArrowDown className="w-4 h-4" /></button>
                      <button onClick={() => removeFile(i)} className="p-1 hover:bg-red-100 rounded text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {!result && !processing && (
              <button onClick={handleProcess} className="w-full btn-primary py-3">Merge PDFs</button>
            )}
            {processing && <ProcessingState message="Merging PDFs..." />}
            {result && (
              <div className="card p-6 animate-slide-up">
                <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Merged PDF Ready</h2>
                <DownloadButton onDownload={handleDownload} size={result.length} label="Download Merged PDF" />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
