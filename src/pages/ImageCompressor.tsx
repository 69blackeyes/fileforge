import { useState, useCallback } from 'react';
import { SEO } from '../components/SEO';
import { DropZone } from '../components/DropZone';
import { FilePreview } from '../components/FilePreview';
import { DownloadButton } from '../components/DownloadButton';
import { ErrorMessage } from '../components/ErrorMessage';
import { ProcessingState } from '../components/ProcessingState';
import { ProgressBar } from '../components/ProgressBar';
import { compressImage } from '../utils/imageProcessing';
import { formatBytes, getReductionPercent, downloadBlob, generateFilename } from '../utils/fileHelpers';
import { SUPPORTED_IMAGE_TYPES } from '../utils/constants';
import { Shield, Minimize2, RotateCcw } from 'lucide-react';

export function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [quality, setQuality] = useState(80);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
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

  const handleProcess = async () => {
    if (!file) return;
    setProcessing(true);
    setProgress(10);
    setError(null);

    try {
      setProgress(40);
      const blob = await compressImage(file, quality);
      setProgress(80);
      const url = URL.createObjectURL(blob);
      setResult(blob);
      setResultUrl(url);
      setProgress(100);
    } catch {
      setError('Something went wrong while processing this file. Please try another file.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (result && file) {
      const ext = file.type === 'image/png' ? 'png' : 'jpg';
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
    setProgress(0);
  };

  return (
    <>
      <SEO
        title="Free Image Compressor Online – Compress JPG, PNG & WEBP"
        description="Compress images online for free. Reduce file size while maintaining quality. All processing happens in your browser — no uploads."
        path="/image-compressor"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mb-4">
            <Minimize2 className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Image Compressor</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Reduce image file size while keeping quality</p>
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
            sublabel="JPG, PNG, or WEBP up to 50MB"
            icon="image"
          />
        ) : (
          <div className="space-y-6 animate-fade-in">
            {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900 dark:text-gray-100">Selected File</h2>
                <button onClick={handleReset} className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1">
                  <RotateCcw className="w-4 h-4" />
                  Process another file
                </button>
              </div>
              <FilePreview file={file} previewUrl={previewUrl} />
              <p className="mt-2 text-sm text-gray-500">Original size: {formatBytes(file.size)}</p>
            </div>

            {!result && !processing && (
              <div className="card p-6">
                <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Compression Settings</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Quality</label>
                      <span className="text-sm font-medium text-primary-600">{quality}%</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={quality}
                      onChange={(e) => setQuality(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
                    />
                    <div className="flex justify-between mt-1 text-xs text-gray-500">
                      <span>Smaller file</span>
                      <span>Better quality</span>
                    </div>
                  </div>

                  <button
                    onClick={handleProcess}
                    className="w-full btn-primary py-3"
                  >
                    Compress Image
                  </button>
                </div>
              </div>
            )}

            {processing && (
              <div className="card p-6">
                <ProgressBar progress={progress} label="Compressing..." />
              </div>
            )}

            {result && file && (
              <div className="card p-6 animate-slide-up">
                <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Result</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Original</p>
                    <img src={previewUrl} alt="Original" className="w-full rounded-lg border border-gray-200 dark:border-gray-700" />
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{formatBytes(file.size)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Compressed</p>
                    <img src={resultUrl} alt="Compressed" className="w-full rounded-lg border border-gray-200 dark:border-gray-700" />
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      {formatBytes(result.size)} 
                      <span className="text-green-600 dark:text-green-400 ml-2">
                        -{getReductionPercent(file.size, result.size)}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <DownloadButton
                    onDownload={handleDownload}
                    size={result.size}
                    label="Download Compressed Image"
                  />
                  <button onClick={handleReset} className="btn-secondary">
                    <RotateCcw className="w-4 h-4" />
                    Process Another File
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
