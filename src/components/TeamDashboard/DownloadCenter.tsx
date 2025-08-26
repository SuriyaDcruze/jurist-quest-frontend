import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Eye } from "lucide-react";
import useDownloads from "@/hooks/useDownloads";
import DownloadCenterSkeleton from "@/components/skeleton/TeamDashboard/DownloadCenterSkeleton";
import { format } from 'date-fns';
import { useState, useEffect, ReactNode, forwardRef, useRef } from "react";
import { Document, Page, pdfjs } from 'react-pdf';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker?url';
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
import HTMLFlipBook from 'react-pageflip';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { ArrowLeft, ArrowRight, Plus, Minus } from "lucide-react";

// Fixed PDFFlipbook Component
type PagesProps = {
  children: ReactNode;
};

const Pages = forwardRef<HTMLDivElement, PagesProps>(({ children }, ref) => (
  <div ref={ref} className="demoPage">
    <div>{children}</div>
  </div>
));
Pages.displayName = 'Pages';

function PDFFlipbook({ pdfUrl, onClose, title }) {
  const [numPages, setNumPages] = useState(0);
  const [flipBookKey, setFlipBookKey] = useState(Date.now());
  const [error, setError] = useState(null);
  const [pdfDocument, setPdfDocument] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = window.innerWidth < 768;
  const [showUsageTip, setShowUsageTip] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const flipBookRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowUsageTip(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Handle mouse wheel zoom
  useEffect(() => {
    const handleWheel = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        setZoomLevel(prev => Math.max(0.5, Math.min(3, prev + delta)));
      }
    };

    document.addEventListener('wheel', handleWheel, { passive: false });
    return () => document.removeEventListener('wheel', handleWheel);
  }, []);

  const goToPreviousPage = () => {
    if (flipBookRef.current && currentPage > 0) {
      flipBookRef.current.pageFlip().flipPrev();
    }
  };

  const goToNextPage = () => {
    if (flipBookRef.current && currentPage < numPages - 1) {
      flipBookRef.current.pageFlip().flipNext();
    }
  };

  const handleFlipChange = (e) => {
    setCurrentPage(e.data);
  };

  function onDocumentLoadSuccess({ numPages, ...documentData }) {
    setNumPages(numPages);
    setPdfDocument(documentData);
    setFlipBookKey(Date.now());
    setError(null);
    setIsLoading(false);
    console.log('PDF loaded successfully with', numPages, 'pages');
  }

  function onDocumentLoadError(error) {
    console.error('PDF loading failed:', error);
    setError('Failed to load PDF. Please try downloading the file or contact support.');
    setIsLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-hidden">
      <div className="relative w-full h-full flex flex-col items-center justify-start">
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-50">
          <div className="text-white">
            <h2 className="text-xl font-semibold">{title}</h2>
          </div>
          <div className="flex gap-2">
            {showUsageTip && (
              <div className="bg-white text-black p-3 rounded-lg shadow-lg mr-2 max-w-xs">
                <p className="font-medium">How to use:</p>
                <ul className="list-disc pl-5 text-sm">
                  <li>Click and drag corners to flip pages</li>
                  <li>Hold Ctrl/Cmd + mouse wheel to zoom in/out</li>
                  <li>Click arrows on sides to navigate</li>
                  <li>Current zoom: {Math.round(zoomLevel * 100)}%</li>
                </ul>
              </div>
            )}
            <Button
              onClick={onClose}
              className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
            >
              Close
            </Button>
          </div>
        </div>

        <div className="w-screen h-screen flex justify-center items-center relative">
          {/* Navigation Arrows */}
          {!isLoading && !error && numPages > 0 && (
            <>
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 0}
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 z-40 bg-white/80 hover:bg-white text-black rounded-full p-3 shadow-lg transition-all ${
                  currentPage === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
                }`}
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <button
                onClick={goToNextPage}
                disabled={currentPage >= numPages - 1}
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 z-40 bg-white/80 hover:bg-white text-black rounded-full p-3 shadow-lg transition-all ${
                  currentPage >= numPages - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
                }`}
              >
                <ArrowRight className="w-6 h-6" />
              </button>
            </>
          )}

          {error ? (
            <div className="text-white text-center p-4">
              <p>{error}</p>
              <Button
                onClick={onClose}
                className="mt-4 bg-slate-900 text-white rounded hover:bg-slate-800"
              >
                Close and Try Again
              </Button>
            </div>
          ) : isLoading ? (
            <div className="text-white text-center p-4">
              <p>Loading PDF...</p>
            </div>
          ) : numPages > 0 ? (
            <div 
              className="w-full pl-8 flex items-center justify-center overflow-hidden"
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center' }}
            >
              <HTMLFlipBook
                key={flipBookKey}
                ref={flipBookRef}
                width={isMobile ? 300 : 550}
                height={isMobile ? 300 : 700}
                size="stretch"
                minWidth={315}
                maxWidth={550}
                minHeight={500}
                maxHeight={1100}
                showCover={true}
                drawShadow={false}
                mobileScrollSupport={false}
                startPage={0}
                usePortrait={isMobile}
                flippingTime={1000}
                maxShadowOpacity={0.5}
                startZIndex={0}
                autoSize={true}
                clickEventForward={true}
                useMouseEvents={true}
                swipeDistance={30}
                showPageCorners={true}
                disableFlipByClick={false}
                className="flipbook-container"
                style={{ backgroundColor: 'transparent' }}
                onFlip={handleFlipChange}
                onChangeOrientation={() => setFlipBookKey(Date.now())}
              >
                {Array.from(new Array(numPages), (_, index) => (
                  <Pages key={index}>
                    <Document file={pdfUrl}>
                      <Page
                        pageNumber={index + 1}
                        width={isMobile ? 330 : 550}
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                      />
                    </Document>
                  </Pages>
                ))}
              </HTMLFlipBook>
            </div>
          ) : null}

          {/* Page indicator */}
          {!isLoading && !error && numPages > 0 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/80 text-black px-4 py-2 rounded-full shadow-lg">
              Page {currentPage + 1} of {numPages}
            </div>
          )}

          {/* Zoom controls */}
          {!isLoading && !error && numPages > 0 && (
            <div className="absolute top-20 right-4 flex flex-col gap-2">
              <button
                onClick={() => setZoomLevel(prev => Math.min(3, prev + 0.2))}
                className="bg-white/80 hover:bg-white text-black rounded-full p-2 shadow-lg transition-all hover:scale-110"
                title="Zoom In"
              >
                <Plus className="w-5 h-5" />
              </button>
              <button
                onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.2))}
                className="bg-white/80 hover:bg-white text-black rounded-full p-2 shadow-lg transition-all hover:scale-110"
                title="Zoom Out"
              >
                <Minus className="w-5 h-5" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="bg-white/80 hover:bg-white text-black rounded px-3 py-2 shadow-lg transition-all hover:scale-110 text-xs font-medium"
                title="Reset Zoom"
              >
                {Math.round(zoomLevel * 100)}%
              </button>
            </div>
          )}
        </div>

        {/* Single Document component for loading - outside the flipbook */}
        <div style={{ display: 'none' }}>
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
          />
        </div>
      </div>
    </div>
  );
}

const DownloadCenter = () => {
  const { downloads, isLoading, error } = useDownloads();
  const [showFlipbook, setShowFlipbook] = useState(null);
  const [flipbookTitle, setFlipbookTitle] = useState(null);

  const handlePreview = (url: string, title: string) => {
    setShowFlipbook(url);
    setFlipbookTitle(title);
  }

  const handleClosePreview = () => {
    setShowFlipbook(null);
    setFlipbookTitle(null);
  }

  const handleDownload = (fileUrl: string) => {
    window.open(fileUrl, "_blank");
  };

  if (isLoading) {
    return <DownloadCenterSkeleton />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (downloads.length === 0) {
    return (
      <div className="text-gray-500 p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
          <Download className="h-8 w-8 text-gray-500" />
        </div>
        <h3 className="font-semibold text-gray-700 text-lg mb-2">No Materials Available</h3>
        <p className="text-sm text-gray-600">
          Your download materials will be available soon! Please check back later for the files and resources related to your round.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-2 sm:p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl text-gray-900">Competition Materials</CardTitle>
          <CardDescription>
            Essential Documents and Resources for the Competition
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Desktop/tablet table view */}
          <div className="w-full overflow-x-auto hidden sm:block">
            <table className="min-w-[600px] w-full border-collapse border border-slate-300 text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-100">
                  <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-medium text-gray-900">Name</th>
                  <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-medium text-gray-900">Format</th>
                  <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-medium text-gray-900">Size</th>
                  <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-medium text-gray-900">Uploaded On</th>
                  <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-medium text-gray-900">Deadline</th>
                  <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-medium text-gray-900"></th>
                </tr>
              </thead>
              <tbody>
                {downloads.map((item, index) => (
                  <tr key={index} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="py-3 sm:py-4 px-2 sm:px-4 flex items-center gap-2 sm:gap-3">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <div className="flex items-center gap-1 sm:gap-2">
                        <span className="font-medium text-gray-900 text-xs sm:text-sm">{item.name}</span>
                        {item.important && (
                          <Badge className="bg-red-500 text-white text-[10px] sm:text-xs rounded-md px-1.5 py-0.5 sm:px-2 sm:py-1">
                            Important
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-gray-600">{item.format}</td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-gray-600">{item.size}</td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-gray-600">{format(new Date(item.created_at), 'dd/MM/yyyy')}</td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-gray-600">{item.deadline ? format(new Date(item.deadline), 'dd/MM/yyyy HH:mm') : "N/A"}</td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4">
                      <div className="flex gap-2">
                        {item.format.toLowerCase() === 'pdf' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 bg-transparent"
                            onClick={() => handlePreview(item.file, item.name || "Document Preview")}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Preview
                          </Button>
                        )}
                        <Button
                          size="sm"
                          onClick={() => handleDownload(item.file)}
                          className="bg-[#2d4817] hover:bg-[#2a4015] text-white flex items-center gap-1"
                        >
                          <Download className="h-4 w-4" />
                          <span className="hidden xs:inline">Download</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile card/list view */}
          <div className="block sm:hidden space-y-4">
            {downloads.map((item, index) => (
              <div key={index} className="border border-slate-200 rounded-lg p-3 flex flex-col gap-2 bg-slate-50">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-gray-900 text-sm">{item.name}</span>
                  {item.important && (
                    <Badge className="bg-red-500 text-white text-[10px] rounded-md px-2 py-0.5 ml-2">
                      Important
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                  <span><b>Format:</b> {item.format}</span>
                  <span><b>Size:</b> {item.size}</span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                  <span><b>Uploaded:</b> {format(new Date(item.created_at), 'dd/MM/yyyy')}</span>
                  <span><b>Deadline:</b> {item.deadline ? format(new Date(item.deadline), 'dd/MM/yyyy HH:mm') : "N/A"}</span>
                </div>
                <div className="flex gap-2 mt-2">
                  {item.format.toLowerCase() === 'pdf' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePreview(item.file.replace("http://", "https://"), item.name || "Document Preview")}
                      className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 bg-transparent flex-1"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={() => handleDownload(item.file.replace("http://", "https://"))}
                    className="bg-[#2d4817] hover:bg-[#2a4015] text-white flex items-center gap-1 w-full justify-center flex-1"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {showFlipbook && (
        <PDFFlipbook 
          pdfUrl={showFlipbook} 
          onClose={handleClosePreview} 
          title={flipbookTitle}
        />
      )}
    </div>
  );
};

export default DownloadCenter;
