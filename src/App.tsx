import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Tools } from './pages/Tools';
import { About } from './pages/About';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { ImageCompressor } from './pages/ImageCompressor';
import { ImageCropper } from './pages/ImageCropper';
import { ImageResizer } from './pages/ImageResizer';
import { ImageConverter } from './pages/ImageConverter';
import { ImageRotator } from './pages/ImageRotator';
import { ImageFlipper } from './pages/ImageFlipper';
import { ImageMetadataRemover } from './pages/ImageMetadataRemover';
import { GrayscaleConverter } from './pages/GrayscaleConverter';
import { ImageDimensionsChecker } from './pages/ImageDimensionsChecker';
import { JpgToPdf } from './pages/JpgToPdf';
import { PngToPdf } from './pages/PngToPdf';
import { ImagesToPdf } from './pages/ImagesToPdf';
import { PdfCompressor } from './pages/PdfCompressor';
import { PdfToJpg } from './pages/PdfToJpg';
import { PdfToPng } from './pages/PdfToPng';
import { PdfMerge } from './pages/PdfMerge';
import { PdfSplit } from './pages/PdfSplit';
import { PdfPageRotator } from './pages/PdfPageRotator';
import { PdfPageExtractor } from './pages/PdfPageExtractor';
import { PdfPageDeleter } from './pages/PdfPageDeleter';
import { PdfPageReorderer } from './pages/PdfPageReorderer';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/image-compressor" element={<ImageCompressor />} />
        <Route path="/image-cropper" element={<ImageCropper />} />
        <Route path="/image-resizer" element={<ImageResizer />} />
        <Route path="/image-converter" element={<ImageConverter />} />
        <Route path="/image-rotator" element={<ImageRotator />} />
        <Route path="/image-flipper" element={<ImageFlipper />} />
        <Route path="/image-metadata" element={<ImageMetadataRemover />} />
        <Route path="/grayscale" element={<GrayscaleConverter />} />
        <Route path="/dimensions" element={<ImageDimensionsChecker />} />
        <Route path="/jpg-to-pdf" element={<JpgToPdf />} />
        <Route path="/png-to-pdf" element={<PngToPdf />} />
        <Route path="/images-to-pdf" element={<ImagesToPdf />} />
        <Route path="/pdf-compressor" element={<PdfCompressor />} />
        <Route path="/pdf-to-jpg" element={<PdfToJpg />} />
        <Route path="/pdf-to-png" element={<PdfToPng />} />
        <Route path="/pdf-merge" element={<PdfMerge />} />
        <Route path="/pdf-split" element={<PdfSplit />} />
        <Route path="/pdf-rotate" element={<PdfPageRotator />} />
        <Route path="/pdf-extract" element={<PdfPageExtractor />} />
        <Route path="/pdf-delete" element={<PdfPageDeleter />} />
        <Route path="/pdf-reorder" element={<PdfPageReorderer />} />
      </Route>
    </Routes>
  );
}

export default App;
