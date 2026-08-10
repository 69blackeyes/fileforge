import { PDFDocument, PageSizes, degrees as pdfDegrees } from 'pdf-lib';
import { loadImage, createCanvas } from './imageProcessing';

export async function createPdfFromImages(
  files: File[],
  pageSize: string = 'A4',
  orientation: 'portrait' | 'landscape' = 'portrait',
  margin: number = 20
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const size = PageSizes[pageSize as keyof typeof PageSizes] || PageSizes.A4;

  for (const file of files) {
    const img = await loadImage(file);
    let pageWidth = size[0];
    let pageHeight = size[1];

    if (orientation === 'landscape') {
      [pageWidth, pageHeight] = [pageHeight, pageWidth];
    }

    const page = pdfDoc.addPage([pageWidth, pageHeight]);
    const contentWidth = pageWidth - margin * 2;
    const contentHeight = pageHeight - margin * 2;

    const imgAspect = img.naturalWidth / img.naturalHeight;
    const contentAspect = contentWidth / contentHeight;

    let drawWidth = contentWidth;
    let drawHeight = contentHeight;

    if (imgAspect > contentAspect) {
      drawHeight = contentWidth / imgAspect;
    } else {
      drawWidth = contentHeight * imgAspect;
    }

    const x = margin + (contentWidth - drawWidth) / 2;
    const y = margin + (contentHeight - drawHeight) / 2;

    let embeddedImage;
    if (file.type === 'image/png') {
      const bytes = await file.arrayBuffer();
      embeddedImage = await pdfDoc.embedPng(bytes);
    } else {
      const { canvas, ctx } = createCanvas(img.naturalWidth, img.naturalHeight);
      ctx.drawImage(img, 0, 0);
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => b ? resolve(b) : reject(new Error('Failed')), 'image/jpeg', 0.92);
      });
      const bytes = await blob.arrayBuffer();
      embeddedImage = await pdfDoc.embedJpg(bytes);
    }

    page.drawImage(embeddedImage, { x, y, width: drawWidth, height: drawHeight });
  }

  return pdfDoc.save();
}

export async function mergePdfs(files: File[]): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  return mergedPdf.save();
}

export async function splitPdf(file: File, ranges: string): Promise<Uint8Array[]> {
  const bytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(bytes);
  const totalPages = pdf.getPageCount();
  const results: Uint8Array[] = [];

  const parseRanges = (rangeStr: string): number[][] => {
    const parts = rangeStr.split(',').map(p => p.trim());
    const pages: number[][] = [];

    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(Number);
        const group: number[] = [];
        for (let i = start - 1; i < end && i < totalPages; i++) {
          group.push(i);
        }
        if (group.length > 0) pages.push(group);
      } else {
        const page = Number(part) - 1;
        if (page >= 0 && page < totalPages) {
          pages.push([page]);
        }
      }
    }
    return pages;
  };

  const pageGroups = parseRanges(ranges);

  for (const group of pageGroups) {
    const newPdf = await PDFDocument.create();
    const copiedPages = await newPdf.copyPages(pdf, group);
    copiedPages.forEach((page) => newPdf.addPage(page));
    results.push(await newPdf.save());
  }

  return results;
}

export async function rotatePdf(file: File, degrees: number, pages?: number[]): Promise<Uint8Array> {
  const bytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(bytes);
  const allPages = pdf.getPages();

  const targetPages = pages ? pages.map(p => p - 1).filter(p => p >= 0 && p < allPages.length) : allPages.map((_, i) => i);

  for (const pageIndex of targetPages) {
    const page = allPages[pageIndex];
    const currentRotation = page.getRotation().angle;
    page.setRotation(pdfDegrees(currentRotation + degrees));
  }

  return pdf.save();
}

export async function extractPdfPages(file: File, pageNumbers: number[]): Promise<Uint8Array> {
  const bytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(bytes);
  const newPdf = await PDFDocument.create();

  const indices = pageNumbers.map(p => p - 1).filter(p => p >= 0 && p < pdf.getPageCount());
  const copiedPages = await newPdf.copyPages(pdf, indices);
  copiedPages.forEach((page) => newPdf.addPage(page));

  return newPdf.save();
}

export async function deletePdfPages(file: File, pageNumbers: number[]): Promise<Uint8Array> {
  const bytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(bytes);
  const newPdf = await PDFDocument.create();

  const deleteSet = new Set(pageNumbers.map(p => p - 1));
  const keepIndices = pdf.getPageIndices().filter(i => !deleteSet.has(i));

  const copiedPages = await newPdf.copyPages(pdf, keepIndices);
  copiedPages.forEach((page) => newPdf.addPage(page));

  return newPdf.save();
}

export async function reorderPdfPages(file: File, newOrder: number[]): Promise<Uint8Array> {
  const bytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(bytes);
  const newPdf = await PDFDocument.create();

  const indices = newOrder.map(p => p - 1).filter(p => p >= 0 && p < pdf.getPageCount());
  const copiedPages = await newPdf.copyPages(pdf, indices);
  copiedPages.forEach((page) => newPdf.addPage(page));

  return newPdf.save();
}

export async function getPdfPageCount(file: File): Promise<number> {
  const bytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(bytes);
  return pdf.getPageCount();
}
