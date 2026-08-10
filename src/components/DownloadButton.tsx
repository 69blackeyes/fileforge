import { Download } from 'lucide-react';
import { formatBytes } from '../utils/fileHelpers';

interface DownloadButtonProps {
  onDownload: () => void;
  filename?: string;
  size?: number;
  label?: string;
  variant?: 'primary' | 'secondary';
}

export function DownloadButton({
  onDownload,
  filename,
  size,
  label = 'Download',
  variant = 'primary',
}: DownloadButtonProps) {
  return (
    <button
      onClick={onDownload}
      className={`
        inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all
        ${variant === 'primary'
          ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm'
          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
        }
      `}
    >
      <Download className="w-4 h-4" />
      <span>{label}</span>
      {size !== undefined && (
        <span className="text-xs opacity-75">({formatBytes(size)})</span>
      )}
    </button>
  );
}
