import { useState, useCallback } from 'react';
import { SEO } from '../components/SEO';
import { DropZone } from '../components/DropZone';
import { ErrorMessage } from '../components/ErrorMessage';
import { getImageDimensions } from '../utils/imageProcessing';
import { formatBytes } from '../utils/fileHelpers';
import { SUPPORTED_IMAGE_TYPES } from '../utils/constants';
import { Shield, Ruler, RotateCcw } from 'lucide-react';

export function ImageDimensionsChecker() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [dims, setDims] = useState<{ width: number; height: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = useCallback(async (files: File[]) => {
    const f = files[0];
    if (!SUPPORTED_IMAGE_TYPES.includes(f.type)) {
      setError('Please upload a JPG, PNG, or WEBP image.');
      return;
    }
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setError(null);
    try {
      const d = await getImageDimensions(f);
      setDims(d);
    } catch {
      setError('Could not read image dimensions.');
    }
  }, []);

  const handleReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl('');
    setDims(null);
    setError(null);
  };

  return (
    <>
      <SEO
        title="Free Image Dimensions Checker – View Width & Height"
        description="Check image dimensions online for free. View width, height, and file size instantly in your browser."
        path="/dimensions"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mb-4">
            <Ruler className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Dimensions Checker</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">View image width, height, and file info</p>
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

            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900 dark:text-gray-100">Image Info</h2>
                <button onClick={handleReset} className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1">
                  <RotateCcw className="w-4 h-4" />
                  Check another
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <img src={previewUrl} alt="Preview" className="max-w-full rounded-lg border border-gray-200 dark:border-gray-700" />
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-500">Filename</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100 break-all">{file.name}</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-500">File Size</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{formatBytes(file.size)}</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-500">Format</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100 uppercase">{file.type.split('/')[1]}</p>
                  </div>
                  {dims && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                        <p className="text-sm text-primary-600 dark:text-primary-400">Width</p>
                        <p className="text-2xl font-bold text-primary-700 dark:text-primary-300">{dims.width}px</p>
                      </div>
                      <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                        <p className="text-sm text-primary-600 dark:text-primary-400">Height</p>
                        <p className="text-2xl font-bold text-primary-700 dark:text-primary-300">{dims.height}px</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
