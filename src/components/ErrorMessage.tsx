import { AlertCircle, X } from 'lucide-react';
import { useState } from 'react';

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
}

export function ErrorMessage({ message, onDismiss }: ErrorMessageProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm text-red-700 dark:text-red-300">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={() => { setVisible(false); onDismiss(); }}
          className="p-1 hover:bg-red-100 dark:hover:bg-red-800 rounded transition-colors"
          aria-label="Dismiss error"
        >
          <X className="w-4 h-4 text-red-500" />
        </button>
      )}
    </div>
  );
}
