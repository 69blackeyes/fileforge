import { useState, useCallback, useRef, useEffect } from 'react';
import { SEO } from '../components/SEO';
import { DropZone } from '../components/DropZone';
import { ErrorMessage } from '../components/ErrorMessage';
import { DownloadButton } from '../components/DownloadButton';
import { ProcessingState } from '../components/ProcessingState';
import { cropImage } from '../utils/imageProcessing';
import { formatBytes, downloadBlob, generateFilename } from '../utils/fileHelpers';
import { SUPPORTED_IMAGE_TYPES, ASPECT_RATIOS } from '../utils/constants';
import { Shield, Crop, RotateCcw, ZoomIn, ZoomOut, RotateCw, FlipHorizontal } from 'lucide-react';

export function ImageCropper() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [imgDims, setImgDims] = useState({ width: 0, height: 0 });
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [aspectRatio, setAspectRatio] = useState('free');
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

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
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setZoom(1);

    const img = new Image();
    img.onload = () => {
      setImgDims({ width: img.naturalWidth, height: img.naturalHeight });
      setCrop({ x: 0, y: 0, width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = url;
  }, []);

  const handleProcess = async () => {
    if (!file || !canvasRef.current) return;
    setProcessing(true);
    setError(null);

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas error');

      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = previewUrl;
      });

      canvas.width = crop.width;
      canvas.height = crop.height;

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);
      ctx.drawImage(img, -crop.x, -crop.y);
      ctx.restore();

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => b ? resolve(b) : reject(new Error('Failed')), file.type, 0.95);
      });

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
    setCrop({ x: 0, y: 0, width: 0, height: 0 });
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setZoom(1);
  };

  const handleAspectChange = (value: string) => {
    setAspectRatio(value);
    if (value === 'free') return;
    const ratio = parseFloat(value);
    const newHeight = crop.width / ratio;
    setCrop(prev => ({ ...prev, height: Math.min(newHeight, imgDims.height) }));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - rect.left - crop.x * (rect.width / imgDims.width),
      y: e.clientY - rect.top - crop.y * (rect.height / imgDims.height),
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scaleX = imgDims.width / rect.width;
    const scaleY = imgDims.height / rect.height;
    const newX = (e.clientX - rect.left - dragStart.x) * scaleX;
    const newY = (e.clientY - rect.top - dragStart.y) * scaleY;
    setCrop(prev => ({
      ...prev,
      x: Math.max(0, Math.min(newX, imgDims.width - prev.width)),
      y: Math.max(0, Math.min(newY, imgDims.height - prev.height)),
    }));
  };

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    if (file && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.onload = () => {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(flipH ? -zoom : zoom, flipV ? -zoom : zoom);
        ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
        ctx.restore();
      };
      img.src = previewUrl;
    }
  }, [file, previewUrl, rotation, flipH, flipV, zoom]);

  return (
    <>
      <SEO
        title="Free Image Cropper Online – Crop JPG, PNG & WEBP"
        description="Crop images online for free. Custom dimensions, aspect ratios, rotate and flip. All processing in your browser."
        path="/image-cropper"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mb-4">
            <Crop className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Image Cropper</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Crop, rotate, and flip your images</p>
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
              <p className="text-sm text-gray-500">{formatBytes(file.size)}</p>
              <button onClick={handleReset} className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1">
                <RotateCcw className="w-4 h-4" />
                New image
              </button>
            </div>

            {!result && !processing && (
              <>
                <div className="card p-4 overflow-auto">
                  <div
                    ref={containerRef}
                    className="relative inline-block cursor-move"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  >
                    <canvas
                      ref={canvasRef}
                      className="max-w-full h-auto border border-gray-300 dark:border-gray-600 rounded"
                    />
                  </div>
                </div>

                <div className="card p-6 space-y-4">
                  <h2 className="font-semibold text-gray-900 dark:text-gray-100">Adjustments</h2>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Aspect Ratio</label>
                      <select
                        value={aspectRatio}
                        onChange={(e) => handleAspectChange(e.target.value)}
                        className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
                      >
                        {ASPECT_RATIOS.map(r => (
                          <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Width</label>
                      <input
                        type="number"
                        value={Math.round(crop.width)}
                        onChange={(e) => setCrop(prev => ({ ...prev, width: Number(e.target.value) }))}
                        className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Height</label>
                      <input
                        type="number"
                        value={Math.round(crop.height)}
                        onChange={(e) => setCrop(prev => ({ ...prev, height: Number(e.target.value) }))}
                        className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Rotation</label>
                      <div className="mt-1 flex gap-1">
                        <button onClick={() => setRotation(prev => prev - 90)} className="flex-1 px-2 py-2 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
                          <RotateCcw className="w-4 h-4 mx-auto" />
                        </button>
                        <button onClick={() => setRotation(prev => prev + 90)} className="flex-1 px-2 py-2 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
                          <RotateCw className="w-4 h-4 mx-auto" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setFlipH(!flipH)} className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium border ${flipH ? 'bg-primary-50 border-primary-300 text-primary-700' : 'bg-gray-50 border-gray-300 text-gray-700'}`}>
                      <FlipHorizontal className="w-4 h-4 inline mr-1" />
                      Flip H
                    </button>
                    <button onClick={() => setFlipV(!flipV)} className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium border ${flipV ? 'bg-primary-50 border-primary-300 text-primary-700' : 'bg-gray-50 border-gray-300 text-gray-700'}`}>
                      <FlipHorizontal className="w-4 h-4 inline mr-1 rotate-90" />
                      Flip V
                    </button>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Zoom: {zoom.toFixed(1)}x</label>
                    <input
                      type="range"
                      min="0.5"
                      max="3"
                      step="0.1"
                      value={zoom}
                      onChange={(e) => setZoom(Number(e.target.value))}
                      className="w-full mt-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
                    />
                  </div>

                  <button onClick={handleProcess} className="w-full btn-primary py-3">
                    Apply & Download
                  </button>
                </div>
              </>
            )}

            {processing && <ProcessingState message="Applying changes..." />}

            {result && (
              <div className="card p-6 animate-slide-up">
                <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Result</h2>
                <img src={resultUrl} alt="Result" className="max-w-full rounded-lg border border-gray-200 dark:border-gray-700" />
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
