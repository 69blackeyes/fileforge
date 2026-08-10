import { X, FileImage, FileText } from 'lucide-react';
import { formatBytes } from '../utils/fileHelpers';

interface FilePreviewProps {
  file: File;
  previewUrl?: string;
  onRemove?: () => void;
  showSize?: boolean;
}

export function FilePreview({ file, previewUrl, onRemove, showSize = true }: FilePreviewProps) {
  const isImage = file.type.startsWith('image/');

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      {isImage && previewUrl ? (
        <img src={previewUrl} alt={file.name} className="w-12 h-12 object-cover rounded" />
      ) : (
        <div className="w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded">
          {isImage ? <FileImage className="w-6 h-6 text-gray-400" /> : <FileText className="w-6 h-6 text-gray-400" />}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{file.name}</p>
        {showSize && (
          <p className="text-xs text-gray-500 dark:text-gray-400">{formatBytes(file.size)}</p>
        )}
      </div>
      {onRemove && (
        <button
          onClick={onRemove}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
          aria-label="Remove file"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      )}
    </div>
  );
}
