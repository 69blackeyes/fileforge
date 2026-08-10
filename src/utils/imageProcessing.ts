import { downloadBlob } from './fileHelpers';

export async function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    img.src = url;
  });
}

export function createCanvas(width: number, height: number): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');
  return { canvas, ctx };
}

export async function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas toBlob failed'));
      },
      type,
      quality
    );
  });
}

export async function compressImage(file: File, quality: number): Promise<Blob> {
  const img = await loadImage(file);
  const { canvas, ctx } = createCanvas(img.naturalWidth, img.naturalHeight);
  ctx.drawImage(img, 0, 0);

  const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
  const blob = await canvasToBlob(canvas, outputType, quality / 100);
  return blob;
}

export async function resizeImage(file: File, width: number, height: number, maintainAspect: boolean): Promise<Blob> {
  const img = await loadImage(file);
  let targetWidth = width;
  let targetHeight = height;

  if (maintainAspect) {
    const aspect = img.naturalWidth / img.naturalHeight;
    if (width / height > aspect) {
      targetWidth = Math.round(height * aspect);
    } else {
      targetHeight = Math.round(width / aspect);
    }
  }

  const { canvas, ctx } = createCanvas(targetWidth, targetHeight);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  const blob = await canvasToBlob(canvas, file.type, 0.92);
  return blob;
}

export async function cropImage(
  file: File,
  cropX: number,
  cropY: number,
  cropWidth: number,
  cropHeight: number
): Promise<Blob> {
  const img = await loadImage(file);
  const { canvas, ctx } = createCanvas(cropWidth, cropHeight);
  ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
  const blob = await canvasToBlob(canvas, file.type, 0.95);
  return blob;
}

export async function rotateImage(file: File, degrees: number): Promise<Blob> {
  const img = await loadImage(file);
  const radians = (degrees * Math.PI) / 180;
  const sin = Math.abs(Math.sin(radians));
  const cos = Math.abs(Math.cos(radians));
  const newWidth = img.naturalWidth * cos + img.naturalHeight * sin;
  const newHeight = img.naturalWidth * sin + img.naturalHeight * cos;

  const { canvas, ctx } = createCanvas(newWidth, newHeight);
  ctx.translate(newWidth / 2, newHeight / 2);
  ctx.rotate(radians);
  ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);

  const blob = await canvasToBlob(canvas, file.type, 0.95);
  return blob;
}

export async function flipImage(file: File, horizontal: boolean): Promise<Blob> {
  const img = await loadImage(file);
  const { canvas, ctx } = createCanvas(img.naturalWidth, img.naturalHeight);

  if (horizontal) {
    ctx.translate(img.naturalWidth, 0);
    ctx.scale(-1, 1);
  } else {
    ctx.translate(0, img.naturalHeight);
    ctx.scale(1, -1);
  }

  ctx.drawImage(img, 0, 0);
  const blob = await canvasToBlob(canvas, file.type, 0.95);
  return blob;
}

export async function convertImageFormat(file: File, outputFormat: string, quality = 0.92): Promise<Blob> {
  const img = await loadImage(file);
  const { canvas, ctx } = createCanvas(img.naturalWidth, img.naturalHeight);

  if (outputFormat === 'image/jpeg' || outputFormat === 'image/jpg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, img.naturalWidth, img.naturalHeight);
  }

  ctx.drawImage(img, 0, 0);
  const blob = await canvasToBlob(canvas, outputFormat, quality);
  return blob;
}

export async function removeMetadata(file: File): Promise<Blob> {
  return convertImageFormat(file, file.type, 0.95);
}

export async function grayscaleImage(file: File): Promise<Blob> {
  const img = await loadImage(file);
  const { canvas, ctx } = createCanvas(img.naturalWidth, img.naturalHeight);
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    data[i] = gray;
    data[i + 1] = gray;
    data[i + 2] = gray;
  }

  ctx.putImageData(imageData, 0, 0);
  const blob = await canvasToBlob(canvas, file.type, 0.95);
  return blob;
}

export async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  const img = await loadImage(file);
  return { width: img.naturalWidth, height: img.naturalHeight };
}
