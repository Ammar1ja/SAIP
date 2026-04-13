'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize,
  ChevronLeft,
  ChevronRight,
  Search,
  Printer,
} from 'lucide-react';
import DownloadFigmaIcon from '@/components/icons/actions/DownloadFigmaIcon';

type PDFDocumentProxy = {
  numPages: number;
  getPage: (pageNum: number) => Promise<{
    getViewport: (options: { scale: number }) => { width: number; height: number };
    render: (options: {
      canvasContext: CanvasRenderingContext2D;
      viewport: { width: number; height: number };
    }) => { promise: Promise<void> };
  }>;
};

type PDFJSLib = {
  getDocument: (src: string) => { promise: Promise<PDFDocumentProxy> };
  GlobalWorkerOptions: { workerSrc: string };
  version: string;
};

interface PDFViewerProps {
  src: string;
  title?: string;
  downloadUrl?: string;
  className?: string;
}

const ZOOM_LEVELS = [75, 100, 125, 150, 200, 250, 300] as const;
const MIN_ZOOM = 75;
const MAX_ZOOM = 300;
const DEFAULT_ZOOM = 75;
const QUALITY_MULTIPLIER = 1.5;

export function PDFViewer({ src, title, downloadUrl }: PDFViewerProps) {
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pageInput, setPageInput] = useState('1');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pdfDocRef = useRef<PDFDocumentProxy | null>(null);
  const pdfjsLibRef = useRef<PDFJSLib | null>(null);
  const pageRenderingRef = useRef(false);
  const pageNumPendingRef = useRef<number | null>(null);

  const renderPage = useCallback(
    async (pageNum: number) => {
      if (!pdfDocRef.current || !canvasRef.current || pageRenderingRef.current) {
        pageNumPendingRef.current = pageNum;
        return;
      }

      pageRenderingRef.current = true;

      try {
        const pdf = pdfDocRef.current;
        const page = await pdf.getPage(pageNum);
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!context) {
          pageRenderingRef.current = false;
          return;
        }

        const devicePixelRatio = window.devicePixelRatio || 1;
        const baseScale = zoom / 100;
        const scale = baseScale * devicePixelRatio * QUALITY_MULTIPLIER;

        const viewport = page.getViewport({ scale });

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        canvas.style.height = `${viewport.height / (devicePixelRatio * QUALITY_MULTIPLIER)}px`;
        canvas.style.width = `${viewport.width / (devicePixelRatio * QUALITY_MULTIPLIER)}px`;

        context.scale(devicePixelRatio * QUALITY_MULTIPLIER, devicePixelRatio * QUALITY_MULTIPLIER);

        const renderContext = {
          canvasContext: context,
          viewport: page.getViewport({ scale: baseScale }),
        };

        await page.render(renderContext).promise;
        pageRenderingRef.current = false;

        if (pageNumPendingRef.current !== null) {
          renderPage(pageNumPendingRef.current);
          pageNumPendingRef.current = null;
        }
      } catch (err) {
        console.error('Error rendering page:', err);
        pageRenderingRef.current = false;
        setError('Failed to render PDF page');
      }
    },
    [zoom],
  );

  const initializePDFJS = useCallback(async (): Promise<PDFJSLib> => {
    if (pdfjsLibRef.current) {
      return pdfjsLibRef.current;
    }

    try {
      const pdfjs = await import('pdfjs-dist');
      const pdfjsLib = pdfjs as unknown as PDFJSLib;

      if (typeof window !== 'undefined') {
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.mjs';
      }

      pdfjsLibRef.current = pdfjsLib;
      return pdfjsLib;
    } catch (err) {
      console.error('Failed to initialize PDF.js:', err);
      throw new Error('Failed to load PDF.js library');
    }
  }, []);

  const loadPDF = useCallback(async () => {
    if (!src) return;

    try {
      setLoading(true);
      setError(null);

      const pdfjsLib = await initializePDFJS();
      const loadingTask = pdfjsLib.getDocument(src);
      const pdf = await loadingTask.promise;

      pdfDocRef.current = pdf;
      setTotalPages(pdf.numPages);
      setCurrentPage(1);
      setPageInput('1');

      if (canvasRef.current) {
        await renderPage(1);
      }

      setLoading(false);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load PDF document';
      console.error('Error loading PDF:', err);
      setError(errorMessage);
      setLoading(false);
    }
  }, [src, renderPage, initializePDFJS]);

  useEffect(() => {
    loadPDF();
  }, [loadPDF]);

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => {
      const currentIndex = ZOOM_LEVELS.findIndex((level) => level >= prev);
      const nextIndex =
        currentIndex >= 0 && currentIndex < ZOOM_LEVELS.length - 1
          ? currentIndex + 1
          : ZOOM_LEVELS.length - 1;
      return Math.min(ZOOM_LEVELS[nextIndex] || prev + 25, MAX_ZOOM);
    });
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => {
      const currentIndex = ZOOM_LEVELS.findIndex((level) => level >= prev);
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : 0;
      return Math.max(ZOOM_LEVELS[prevIndex] || prev - 25, MIN_ZOOM);
    });
  }, []);

  useEffect(() => {
    if (pdfDocRef.current && currentPage > 0 && !loading && !error) {
      renderPage(currentPage);
    }
  }, [zoom, currentPage, loading, error, renderPage]);

  const handlePreviousPage = useCallback(() => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      setPageInput(String(newPage));
    }
  }, [currentPage]);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      setPageInput(String(newPage));
    }
  }, [currentPage, totalPages]);

  const handlePageInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value);
  }, []);

  const handlePageInputBlur = useCallback(() => {
    const pageNum = parseInt(pageInput, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      setPageInput(String(pageNum));
    } else {
      setPageInput(String(currentPage));
    }
  }, [pageInput, totalPages, currentPage]);

  const handlePageInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handlePageInputBlur();
      }
    },
    [handlePageInputBlur],
  );

  useEffect(() => {
    if (pdfDocRef.current && currentPage > 0 && currentPage <= totalPages && !loading && !error) {
      renderPage(currentPage);
    }
  }, [currentPage, totalPages, loading, error, renderPage]);

  const handleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  }, []);

  const handlePrint = useCallback(() => {
    if (downloadUrl || src) {
      const printWindow = window.open(downloadUrl || src, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    }
  }, [downloadUrl, src]);

  const handleDownload = useCallback(() => {
    if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = title || 'document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [downloadUrl, title]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 bg-white w-screen h-screen' : ''}`}
    >
      <div
        className={`relative bg-gray-100 flex-1 ${isFullscreen ? 'w-full rounded-none' : 'rounded-xl'} flex items-center justify-center`}
        style={
          isFullscreen
            ? { height: 'calc(100vh - 80px)', width: '100%', overflow: 'auto' }
            : { minHeight: '800px', maxHeight: '800px', overflow: 'auto' }
        }
      >
        <div className="absolute top-8 right-4 z-10">
          <div className="flex items-center gap-1 bg-white rounded-lg p-4 shadow-md border border-gray-200">
            <button
              type="button"
              onClick={() => console.log('Search clicked')}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-gray-600" />
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Print"
            >
              <Printer className="w-5 h-5 text-gray-600" />
            </button>

            {downloadUrl && (
              <button
                type="button"
                onClick={handleDownload}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                aria-label="Download"
              >
                <DownloadFigmaIcon className="w-5 h-5 text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading PDF...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-white">
            <div className="text-center p-8">
              <p className="text-red-600 mb-4">{error}</p>
              {downloadUrl && (
                <a
                  href={downloadUrl}
                  download
                  className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Download PDF
                </a>
              )}
            </div>
          </div>
        )}

        {!loading && !error && (
          <div className="w-full flex justify-center p-4">
            <canvas ref={canvasRef} className="shadow-lg" />
          </div>
        )}
      </div>

      <div
        className={`flex items-center justify-center gap-6 p-3 border border-gray-200 bg-white rounded-lg shadow-sm z-10 ${isFullscreen ? 'w-full relative bottom-0' : 'mx-auto -mt-18 relative'}`}
        style={{
          width: isFullscreen ? '100%' : 'fit-content',
          maxWidth: isFullscreen ? '100%' : '90%',
        }}
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePreviousPage}
            disabled={currentPage <= 1 || loading}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4 text-gray-700" />
          </button>

          <div className="flex items-center gap-1.5">
            <span className="text-sm text-gray-700 font-medium">Page</span>
            <input
              type="text"
              value={pageInput}
              onChange={handlePageInputChange}
              onBlur={handlePageInputBlur}
              onKeyDown={handlePageInputKeyDown}
              disabled={loading || totalPages === 0}
              className="w-10 px-1.5 py-0.5 text-sm text-center border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:opacity-50 bg-white"
            />
            <span className="text-sm text-gray-700">/ {totalPages || '?'}</span>
          </div>

          <button
            type="button"
            onClick={handleNextPage}
            disabled={currentPage >= totalPages || loading}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4 text-gray-700" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={zoom <= MIN_ZOOM || loading}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4 text-gray-700" />
          </button>

          <span className="text-sm text-gray-700 font-medium min-w-[60px] text-center">
            Zoom {zoom}%
          </span>

          <button
            type="button"
            onClick={handleZoomIn}
            disabled={zoom >= MAX_ZOOM || loading}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4 text-gray-700" />
          </button>
        </div>

        <div className="flex items-center">
          <button
            type="button"
            onClick={handleFullscreen}
            disabled={loading}
            className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 flex items-center gap-1.5"
            aria-label="Full screen"
          >
            <Maximize className="w-4 h-4" />
            <span>Full screen</span>
          </button>
        </div>
      </div>
    </div>
  );
}
