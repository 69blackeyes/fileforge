export interface ToolInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'image' | 'pdf' | 'file';
  path: string;
}

export interface ProcessedFile {
  file: File;
  blob: Blob;
  url: string;
  name: string;
  size: number;
  originalSize: number;
}

export interface ProcessingState {
  isProcessing: boolean;
  progress: number;
  error: string | null;
}
