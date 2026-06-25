import React, { useState, useRef } from "react";
import { FaChevronLeft, FaChevronRight, FaTimes, FaSearchPlus } from "react-icons/fa";

interface ImageGalleryProps {
  images: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  const activeImage = images[activeIndex] || "";

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    
    // Get cursor relative coordinates
    let x = e.clientX - left;
    let y = e.clientY - top;
    
    // Clamp values inside container boundaries
    x = Math.max(0, Math.min(x, width));
    y = Math.max(0, Math.min(y, height));
    
    // Calculate percentage
    const xPercent = (x / width) * 100;
    const yPercent = (y / height) * 100;
    
    setZoomPos({ x: xPercent, y: yPercent });
  };

  const handlePrevImage = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative">
      {/* Gallery Layout Container */}
      <div className="flex flex-col-reverse md:flex-row gap-4">
        
        {/* Thumbnails list */}
        <div className="flex flex-row md:flex-col gap-3 justify-center md:justify-start overflow-x-auto md:overflow-y-auto max-h-[480px] py-1 scrollbar-thin">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-white border-2 rounded-lg p-1.5 flex items-center justify-center overflow-hidden transition-all duration-200 cursor-pointer ${
                activeIndex === idx
                  ? "border-[#201064] shadow-md scale-105"
                  : "border-slate-200 hover:border-slate-400"
              }`}
            >
              <img
                src={img}
                alt={`Product thumbnail ${idx + 1}`}
                className="max-h-full object-contain"
                loading="lazy"
              />
            </button>
          ))}
        </div>

        {/* Main Image View */}
        <div className="flex-1 relative">
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => setIsLightboxOpen(true)}
            className="h-[350px] sm:h-[480px] bg-white border border-slate-200 rounded-xl overflow-hidden flex items-center justify-center p-6 cursor-zoom-in relative select-none"
          >
            <img
              src={activeImage}
              alt="Main Product"
              className="max-h-full object-contain transition-transform duration-300 pointer-events-none"
              loading="lazy"
            />
            
            {/* Magnifier Glass overlay icon */}
            <span className="absolute bottom-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-700 p-2.5 rounded-full shadow-sm">
              <FaSearchPlus size={16} />
            </span>

            {/* Magnifier lens indicator on hover (Desktop only) */}
            {isHovered && (
              <div
                className="absolute bg-[#201064]/10 border border-[#201064]/20 pointer-events-none hidden lg:block rounded-md shadow-inner"
                style={{
                  width: "160px",
                  height: "160px",
                  left: `calc(${zoomPos.x}% - 80px)`,
                  top: `calc(${zoomPos.y}% - 80px)`,
                }}
              />
            )}
          </div>

          {/* Floating Zoom Magnifier Panel (Desktop only, Flipkart/Amazon Style) */}
          {isHovered && (
            <div
              className="absolute top-0 left-[103%] w-[500px] h-[480px] bg-white border border-slate-200 shadow-2xl z-40 rounded-xl overflow-hidden hidden lg:block transition-all duration-300"
              style={{
                pointerEvents: "none"
              }}
            >
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `url(${activeImage})`,
                  backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                  backgroundSize: "220%",
                  backgroundRepeat: "no-repeat",
                }}
              />
            </div>
          )}
        </div>

      </div>

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 bg-black/95 z-[999] flex flex-col justify-between p-4 md:p-8 select-none">
          
          {/* Header Controls */}
          <div className="flex items-center justify-between text-white border-b border-white/10 pb-4">
            <span className="font-semibold text-lg">
              Image {activeIndex + 1} of {images.length}
            </span>
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="text-white hover:text-rose-500 transition cursor-pointer p-2 bg-white/5 rounded-full"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Main Lightbox Display Area */}
          <div className="relative flex-1 flex items-center justify-center p-4">
            
            {/* Left Nav Arrow */}
            <button
              onClick={handlePrevImage}
              className="absolute left-2 md:left-6 text-white hover:text-indigo-400 bg-white/10 hover:bg-white/20 p-4 rounded-full transition cursor-pointer"
            >
              <FaChevronLeft size={22} />
            </button>

            <img
              src={activeImage}
              alt="Lightbox Zoomed"
              className="max-h-[70vh] md:max-h-[75vh] max-w-full object-contain transition duration-300"
            />

            {/* Right Nav Arrow */}
            <button
              onClick={handleNextImage}
              className="absolute right-2 md:right-6 text-white hover:text-indigo-400 bg-white/10 hover:bg-white/20 p-4 rounded-full transition cursor-pointer"
            >
              <FaChevronRight size={22} />
            </button>

          </div>

          {/* Footer Thumbnails bar */}
          <div className="flex justify-center gap-3 overflow-x-auto py-4 border-t border-white/10">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`w-14 h-14 bg-white/10 border-2 rounded-lg p-1 transition-all duration-200 cursor-pointer overflow-hidden ${
                  activeIndex === idx ? "border-indigo-500 scale-105 bg-white" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={img}
                  alt={`Lightbox thumbnail ${idx + 1}`}
                  className="max-h-full mx-auto object-contain"
                  loading="lazy"
                />
              </button>
            ))}
          </div>

        </div>
      )}
    </div>
  );
};

export default ImageGallery;
