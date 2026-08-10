import { useState, useCallback } from 'react';
import { SEO } from '../components/SEO';
import { DropZone } from '../components/DropZone';
import { FilePreview } from '../components/FilePreview';
import { DownloadButton } from '../components/DownloadButton';
import { ErrorMessage } from '../components/ErrorMessage';
import { ProcessingState } from '../components/ProcessingState';
import { createPdfFromImages } from '../utils/pdfProcessing';
import { formatBytes, downloadBytes } from '../utils/fileHelpers';
import { Shield, FileImage, RotateCcw, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';

export function JpgToPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState('A4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [margin, setMargin] = useState(20);

  const handleFiles = useCallback((newFiles: File[]) => {
    const valid = newFiles.filter(f => f.type === 'image/jpeg' || f.type === 'image/jpg');
    if (valid.length !== newFiles.length) {
      setError('Only JPG/JPEG files are accepted for this tool.');
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
      const pdfBytes = await createPdfFromImages(files, pageSize, orientation, margin);
      setResult(pdfBytes);
    } catch {
      setError('Something went wrong while creating the PDF. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (result) {
      downloadBytes(result, 'converted.pdf', 'application/pdf');
    }
  };

  const handleReset = () => {
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setFiles([]);
    setPreviewUrls([]);
    setResult(null);
    setError(null);
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === files.length - 1) return;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newFiles = [...files];
    const newUrls = [...previewUrls];
    [newFiles[index], newFiles[newIndex]] = [newFiles[newIndex], newFiles[index]];
    [newUrls[index], newUrls[newIndex]] = [newUrls[newIndex], newUrls[index]];
    setFiles(newFiles);
    setPreviewUrls(newUrls);
  };

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <SEO
        title="Free JPG to PDF Converter Online"
        description="Convert JPG images to PDF online for free. Multiple images, reorder pages, and customize settings. Browser-based processing."
        path="/jpg-to-pdf"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 mb-4">
            <FileImage className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">JPG to PDF</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Convert JPG images to PDF documents</p>
          <div className="mt-3 inline-flex items-center gap-1.5 privacy-badge">
            <Shield className="w-3.5 h-3.5" />
            <span>Your files are processed locally in your browser and are not uploaded.</span>
          </div>
        </div>

        <DropZone
          onFiles={handleFiles}
          accept="image/jpeg,image/jpg"
          multiple
          label="Drop JPG images here"
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
              <div className="space-y-2">
                {files.map((file, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <img src={previewUrls[i]} alt="" className="w-12 h-12 object-cover rounded" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatBytes(file.size)}</p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => moveFile(i, 'up')} disabled={i === 0} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded disabled:opacity-30">
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button onClick={() => moveFile(i, 'down')} disabled={i === files.length - 1} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded disabled:opacity-30">
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button onClick={() => removeFile(i)} className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {!result && !processing && (
              <div className="card p-6 space-y-4">
                <h2 className="font-semibold text-gray-900 dark:text-gray-100">PDF Settings</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Page Size</label>
                    <select
                      value={pageSize}
                      onChange={(e) => setPageSize(e.target.value)}
                      className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                    >
                      <option value="A4">A4</option>
                      <option value="Letter">Letter</option>
                      <option value="A3">A3</option>
                      <option value="A5">A5</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Orientation</label>
                    <select
                      value={orientation}
                      onChange={(e) => setOrientation(e.target.value as 'portrait' | 'landscape')}
                      className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                    >
                      <option value="portrait">Portrait</option>
                      <option value="landscape">Landscape</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Margin (px)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={margin}
                      onChange={(e) => setMargin(Number(e.target.value))}
                      className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                    />
                  </div>
                </div>
                <button onClick={handleProcess} className="w-full btn-primary py-3">
                  Create PDF
                </button>
              </div>
            )}

            {processing && <ProcessingState message="Creating PDF..." />}

            {result && (
              <div className="card p-6 animate-slide-up">
                <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">PDF Ready</h2>
                <DownloadButton
                  onDownload={handleDownload}
                  size={result.length}
                  label="Download PDF"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
