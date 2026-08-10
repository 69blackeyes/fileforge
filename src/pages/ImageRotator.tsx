import { useState, useCallback } from 'react';
import { SEO } from '../components/SEO';
import { DropZone } from '../components/DropZone';
import { FilePreview } from '../components/FilePreview';
import { DownloadButton } from '../components/DownloadButton';
import { ErrorMessage } from '../components/ErrorMessage';
import { ProcessingState } from '../components/ProcessingState';
import { rotateImage } from '../utils/imageProcessing';
import { formatBytes, downloadBlob, generateFilename } from '../utils/fileHelpers';
import { SUPPORTED_IMAGE_TYPES } from '../utils/constants';
import { Shield, RotateCcw, RotateCw, RotateCcw as RotateLeft, RotateCw as RotateRight, RotateCcw as Rotate180, RotateCcw as Rotate270 } from 'lucide-react';

export function ImageRotator() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleFiles = useCallback((files: File[]) => {
    const f = files[0];
    if (!SUPPORTED_IMAGE_TYPES.includes(f.type)) {
      setError('Please upload a JPG, PNG, or WEBP image.');
      return;
    }
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setResult(null);
    setResultUrl('');
    setError(null);
  }, []);

  const handleRotate = async (degrees: number) => {
    if (!file) return;
    setProcessing(true);
    setError(null);
    try {
      const blob = await rotateImage(file, degrees);
      setResult(blob);
      setResultUrl(URL.createObjectURL(blob));
    } catch {
      setError('Something went wrong while processing this file. Please try another file.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (result && file) {
      const ext = file.type.split('/')[1] || 'png';
      downloadBlob(result, generateFilename(file.name, ext));
    }
  };

  const handleReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(null);
    setPreviewUrl('');
    setResult(null);
    setResultUrl('');
    setError(null);
  };

  return (
    <>
      <SEO
        title="Free Image Rotator Online – Rotate JPG, PNG & WEBP"
        description="Rotate images online for free. 90°, 180°, 270° rotation. All processing in your browser with no uploads."
        path="/image-rotator"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mb-4">
            <RotateCcw className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Image Rotator</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Rotate images by 90°, 180°, or 270°</p>
          <div className="mt-3 inline-flex items-center gap-1.5 privacy-badge">
            <Shield className="w-3.5 h-3.5" />
            <span>Your files are processed locally in your browser and are not uploaded.</span>
          </div>
        </div>

        {!file ? (
          <DropZone
            onFiles={handleFiles}
            accept="image/jpeg,image/jpg,image/png,image/webp"
            label="Drop your image here"
            sublabel="JPG, PNG, or WEBP"
            icon="image"
          />
        ) : (
          <div className="space-y-6 animate-fade-in">
            {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

            <div className="flex items-center justify-between">
              <FilePreview file={file} previewUrl={previewUrl} onRemove={handleReset} />
            </div>

            {!result && !processing && (
              <div className="card p-6">
                <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Rotate</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button onClick={() => handleRotate(-90)} className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all text-center">
                    <RotateLeft className="w-8 h-8 mx-auto mb-2 text-primary-600" />
                    <span className="text-sm font-medium">90° Left</span>
                  </button>
                  <button onClick={() => handleRotate(90)} className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all text-center">
                    <RotateRight className="w-8 h-8 mx-auto mb-2 text-primary-600" />
                    <span className="text-sm font-medium">90° Right</span>
                  </button>
                  <button onClick={() => handleRotate(180)} className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all text-center">
                    <Rotate180 className="w-8 h-8 mx-auto mb-2 text-primary-600" />
                    <span className="text-sm font-medium">180°</span>
                  </button>
                  <button onClick={() => handleRotate(270)} className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all text-center">
                    <Rotate270 className="w-8 h-8 mx-auto mb-2 text-primary-600" />
                    <span className="text-sm font-medium">270°</span>
                  </button>
                </div>
              </div>
            )}

            {processing && <ProcessingState message="Rotating image..." />}

            {result && (
              <div className="card p-6 animate-slide-up">
                <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Result</h2>
                <img src={resultUrl} alt="Rotated" className="max-w-full rounded-lg border border-gray-200 dark:border-gray-700" />
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <DownloadButton onDownload={handleDownload} size={result.size} />
                  <button onClick={handleReset} className="btn-secondary">
                    <RotateCcw className="w-4 h-4" />
                    Process Another
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
