import { useState, useCallback } from 'react';
import { SEO } from '../components/SEO';
import { DropZone } from '../components/DropZone';
import { FilePreview } from '../components/FilePreview';
import { DownloadButton } from '../components/DownloadButton';
import { ErrorMessage } from '../components/ErrorMessage';
import { ProcessingState } from '../components/ProcessingState';
import { removeMetadata } from '../utils/imageProcessing';
import { formatBytes, getReductionPercent, downloadBlob, generateFilename } from '../utils/fileHelpers';
import { SUPPORTED_IMAGE_TYPES } from '../utils/constants';
import { Shield, ShieldCheck, RotateCcw } from 'lucide-react';

export function ImageMetadataRemover() {
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

  const handleProcess = async () => {
    if (!file) return;
    setProcessing(true);
    setError(null);
    try {
      const blob = await removeMetadata(file);
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
        title="Free Image Metadata Remover – Strip EXIF Data"
        description="Remove metadata and EXIF data from images online for free. Protect your privacy with browser-based processing."
        path="/image-metadata"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Metadata Remover</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Remove EXIF and metadata from images</p>
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
              <div className="card p-6 space-y-4">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <p className="text-sm text-yellow-800 dark:text-yellow-300">
                    <strong>Privacy Note:</strong> This tool removes EXIF data including GPS location, 
                    camera information, timestamps, and other metadata from your image. The visual content 
                    remains unchanged.
                  </p>
                </div>
                <button onClick={handleProcess} className="w-full btn-primary py-3">
                  Remove Metadata
                </button>
              </div>
            )}

            {processing && <ProcessingState message="Removing metadata..." />}

            {result && file && (
              <div className="card p-6 animate-slide-up">
                <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Result</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-500">Original</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{formatBytes(file.size)}</p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm text-gray-500">Cleaned</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {formatBytes(result.size)}
                      <span className="text-green-600 dark:text-green-400 text-sm ml-2">
                        -{getReductionPercent(file.size, result.size)}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <DownloadButton onDownload={handleDownload} size={result.size} label="Download Clean Image" />
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
