import { useState, useCallback } from 'react';
import { SEO } from '../components/SEO';
import { DropZone } from '../components/DropZone';
import { FilePreview } from '../components/FilePreview';
import { DownloadButton } from '../components/DownloadButton';
import { ErrorMessage } from '../components/ErrorMessage';
import { ProcessingState } from '../components/ProcessingState';
import { resizeImage } from '../utils/imageProcessing';
import { formatBytes, downloadBlob, generateFilename } from '../utils/fileHelpers';
import { SUPPORTED_IMAGE_TYPES, PRESET_SIZES } from '../utils/constants';
import { Shield, Maximize2, RotateCcw, Lock, Unlock } from 'lucide-react';

export function ImageResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [originalDims, setOriginalDims] = useState({ width: 0, height: 0 });

  const handleFiles = useCallback((files: File[]) => {
    const f = files[0];
    if (!SUPPORTED_IMAGE_TYPES.includes(f.type)) {
      setError('Please upload a JPG, PNG, or WEBP image.');
      return;
    }
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
    setResult(null);
    setResultUrl('');
    setError(null);

    const img = new Image();
    img.onload = () => {
      setOriginalDims({ width: img.naturalWidth, height: img.naturalHeight });
      setWidth(img.naturalWidth);
      setHeight(img.naturalHeight);
    };
    img.src = url;
  }, []);

  const handleProcess = async () => {
    if (!file) return;
    setProcessing(true);
    setError(null);
    try {
      const blob = await resizeImage(file, width, height, maintainAspect);
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
    setWidth(800);
    setHeight(600);
  };

  const handlePreset = (preset: typeof PRESET_SIZES[0]) => {
    if (preset.width === 0 && preset.height === 0) {
      setWidth(originalDims.width);
      setHeight(originalDims.height);
    } else {
      setWidth(preset.width);
      setHeight(preset.height);
    }
  };

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (maintainAspect && originalDims.width > 0) {
      const aspect = originalDims.height / originalDims.width;
      setHeight(Math.round(val * aspect));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (maintainAspect && originalDims.height > 0) {
      const aspect = originalDims.width / originalDims.height;
      setWidth(Math.round(val * aspect));
    }
  };

  return (
    <>
      <SEO
        title="Free Image Resizer Online – Resize JPG, PNG & WEBP"
        description="Resize images to exact dimensions online for free. Lock aspect ratio or set custom size. Browser-based processing."
        path="/image-resizer"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mb-4">
            <Maximize2 className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Image Resizer</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Resize images to exact dimensions</p>
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
              <div className="card p-6 space-y-6">
                <h2 className="font-semibold text-gray-900 dark:text-gray-100">Resize Settings</h2>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Preset Sizes</label>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_SIZES.map(preset => (
                      <button
                        key={preset.label}
                        onClick={() => handlePreset(preset)}
                        className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Width (px)</label>
                    <input
                      type="number"
                      min="1"
                      max="10000"
                      value={width}
                      onChange={(e) => handleWidthChange(Number(e.target.value))}
                      className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Height (px)</label>
                    <input
                      type="number"
                      min="1"
                      max="10000"
                      value={height}
                      onChange={(e) => handleHeightChange(Number(e.target.value))}
                      className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                    />
                  </div>
                </div>

                <button
                  onClick={() => setMaintainAspect(!maintainAspect)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    maintainAspect
                      ? 'bg-primary-50 border-primary-300 text-primary-700 dark:bg-primary-900/30 dark:border-primary-700 dark:text-primary-400'
                      : 'bg-gray-50 border-gray-300 text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300'
                  }`}
                >
                  {maintainAspect ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                  {maintainAspect ? 'Aspect ratio locked' : 'Aspect ratio unlocked'}
                </button>

                <button onClick={handleProcess} className="w-full btn-primary py-3">
                  Resize Image
                </button>
              </div>
            )}

            {processing && <ProcessingState message="Resizing image..." />}

            {result && (
              <div className="card p-6 animate-slide-up">
                <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Result</h2>
                <img src={resultUrl} alt="Resized" className="max-w-full rounded-lg border border-gray-200 dark:border-gray-700" />
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
