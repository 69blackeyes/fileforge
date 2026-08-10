import { useCallback, useState } from 'react';
import { Upload, FileImage, FileText } from 'lucide-react';

interface DropZoneProps {
  onFiles: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  label?: string;
  sublabel?: string;
  icon?: 'image' | 'pdf' | 'generic';
}

export function DropZone({
  onFiles,
  accept = 'image/*',
  multiple = false,
  maxSize = 50 * 1024 * 1024,
  label = 'Drag & drop your file here',
  sublabel = 'or click to browse',
  icon = 'generic',
}: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const IconComponent = icon === 'image' ? FileImage : icon === 'pdf' ? FileText : Upload;

  const handleFiles = useCallback((fileList: FileList | null) => {
    setError(null);
    if (!fileList) return;

    const files = Array.from(fileList);
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        setError(`File too large: ${file.name} (${(file.size / 1024 / 1024).toFixed(1)}MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      onFiles(validFiles);
    }
  }, [onFiles, maxSize]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-200
          ${isDragging 
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-600 bg-gray-50 dark:bg-gray-800/50'
          }
        `}
      >
        <input
          id="file-input"
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <IconComponent className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-primary-500' : 'text-gray-400 dark:text-gray-500'}`} />
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">{label}</p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{sublabel}</p>
        {error && (
          <p className="mt-3 text-sm text-red-500">{error}</p>
        )}
      </div>
    </div>
  );
}
