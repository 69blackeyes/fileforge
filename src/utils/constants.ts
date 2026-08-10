export const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
export const SUPPORTED_PDF_TYPES = ['application/pdf'];

export const ASPECT_RATIOS = [
  { label: 'Free', value: 'free' },
  { label: '1:1', value: '1' },
  { label: '4:3', value: '1.333' },
  { label: '16:9', value: '1.778' },
  { label: '3:2', value: '1.5' },
];

export const PRESET_SIZES = [
  { label: 'Original', width: 0, height: 0 },
  { label: '1920x1080 (HD)', width: 1920, height: 1080 },
  { label: '1280x720 (HD)', width: 1280, height: 720 },
  { label: '1080x1080 (Instagram)', width: 1080, height: 1080 },
  { label: '1200x630 (Facebook)', width: 1200, height: 630 },
  { label: '800x600', width: 800, height: 600 },
  { label: '640x480', width: 640, height: 480 },
  { label: '400x400', width: 400, height: 400 },
  { label: '200x200', width: 200, height: 200 },
];

export const TOOLS: ToolInfo[] = [
  { id: 'image-compressor', name: 'Image Compressor', description: 'Compress JPG, PNG, and WEBP images while maintaining quality.', icon: 'Minimize2', category: 'image', path: '/image-compressor' },
  { id: 'image-cropper', name: 'Image Cropper', description: 'Crop images with custom dimensions and aspect ratios.', icon: 'Crop', category: 'image', path: '/image-cropper' },
  { id: 'image-resizer', name: 'Image Resizer', description: 'Resize images to exact dimensions with aspect ratio lock.', icon: 'Maximize2', category: 'image', path: '/image-resizer' },
  { id: 'image-converter', name: 'Image Converter', description: 'Convert between JPG, PNG, and WEBP formats.', icon: 'RefreshCw', category: 'image', path: '/image-converter' },
  { id: 'jpg-to-pdf', name: 'JPG to PDF', description: 'Convert JPG images to PDF documents.', icon: 'FileImage', category: 'pdf', path: '/jpg-to-pdf' },
  { id: 'png-to-pdf', name: 'PNG to PDF', description: 'Convert PNG images to PDF documents.', icon: 'FileImage', category: 'pdf', path: '/png-to-pdf' },
  { id: 'images-to-pdf', name: 'Images to PDF', description: 'Combine multiple images into a single PDF.', icon: 'Images', category: 'pdf', path: '/images-to-pdf' },
  { id: 'pdf-to-jpg', name: 'PDF to JPG', description: 'Convert PDF pages to JPG images.', icon: 'FileText', category: 'pdf', path: '/pdf-to-jpg' },
  { id: 'pdf-to-png', name: 'PDF to PNG', description: 'Convert PDF pages to PNG images.', icon: 'FileText', category: 'pdf', path: '/pdf-to-png' },
  { id: 'pdf-compressor', name: 'PDF Compressor', description: 'Reduce PDF file size where possible.', icon: 'FileDown', category: 'pdf', path: '/pdf-compressor' },
  { id: 'pdf-merge', name: 'PDF Merge', description: 'Combine multiple PDFs into one document.', icon: 'Merge', category: 'pdf', path: '/pdf-merge' },
  { id: 'pdf-split', name: 'PDF Split', description: 'Split PDFs by page ranges.', icon: 'Split', category: 'pdf', path: '/pdf-split' },
  { id: 'pdf-rotate', name: 'PDF Rotate', description: 'Rotate PDF pages.', icon: 'RotateCw', category: 'pdf', path: '/pdf-rotate' },
  { id: 'pdf-extract', name: 'PDF Extract', description: 'Extract specific pages from a PDF.', icon: 'Scissors', category: 'pdf', path: '/pdf-extract' },
  { id: 'image-rotator', name: 'Image Rotator', description: 'Rotate images by 90, 180, or 270 degrees.', icon: 'RotateCcw', category: 'image', path: '/image-rotator' },
  { id: 'image-flipper', name: 'Image Flipper', description: 'Flip images horizontally or vertically.', icon: 'FlipHorizontal', category: 'image', path: '/image-flipper' },
  { id: 'image-metadata', name: 'Metadata Remover', description: 'Remove metadata from images for privacy.', icon: 'Shield', category: 'image', path: '/image-metadata' },
  { id: 'grayscale', name: 'Grayscale', description: 'Convert images to black and white.', icon: 'Contrast', category: 'image', path: '/grayscale' },
  { id: 'dimensions', name: 'Dimensions Checker', description: 'Check and view image dimensions.', icon: 'Ruler', category: 'image', path: '/dimensions' },
];
