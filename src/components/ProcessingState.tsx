import { Loader2 } from 'lucide-react';

interface ProcessingStateProps {
  message?: string;
}

export function ProcessingState({ message = 'Processing...' }: ProcessingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="w-10 h-10 text-primary-600 animate-spin mb-4" />
      <p className="text-lg font-medium text-gray-700 dark:text-gray-300">{message}</p>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Please wait, this may take a moment</p>
    </div>
  );
}
