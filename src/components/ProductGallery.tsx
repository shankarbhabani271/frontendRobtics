import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight, FaTimes, FaSearchPlus, FaSearchMinus, FaExpand } from "react-icons/fa";

interface ProductGalleryProps {
  images: string[];
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxScale, setLightboxScale] = useState(1);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Hover Magnifier state
  const [lensVisible, setLensVisible] = useState(false);
  const [lensStyle, setLensStyle] = useState<React.CSSProperties>({ display: "none" });
  const containerRef = useRef<HTMLDivElement>(null);

  // Touch Swipe states for mobile
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const handleNext = () => {
    if (images.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    if (images.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleLightboxNext = () => {
    if (images.length === 0) return;
    setLightboxIndex((prev) => (prev + 1) % images.length);
    setLightboxScale(1); // Reset zoom on image change
  };

  const handleLightboxPrev = () => {
    if (images.length === 0) return;
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
    setLightboxScale(1); // Reset zoom on image change
  };

  // Hover zoom magnifier logic
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    
    // Mouse coords relative to image container
    const x = e.clientX - left;
    const y = e.clientY - top;

    // Boundary check
    if (x < 0 || y < 0 || x > width || y > height) {
      setLensVisible(false);
      return;
    }

    const lensSize = 140; // Size of magnifier lens
    const halfLens = lensSize / 2;

    // Target positions for the lens
    let posX = x - halfLens;
    let posY = y - halfLens;

    // Constraint lens to image bounds
    if (posX < 0) posX = 0;
    if (posY < 0) posY = 0;
    if (posX > width - lensSize) posX = width - lensSize;
    if (posY > height - lensSize) posY = height - lensSize;

    // Calculate percentages for background position (offset lens width)
    const bgX = (x / width) * 100;
    const bgY = (y / height) * 100;

    setLensVisible(true);
    setLensStyle({
      left: `${posX}px`,
      top: `${posY}px`,
      backgroundImage: `url(${images[activeIndex]})`,
      backgroundPosition: `${bgX}% ${bgY}%`,
      backgroundSize: `${width * 2.2}px ${height * 2.2}px`, // 2.2x zoom
    });
  };

  const handleMouseLeave = () => {
    setLensVisible(false);
  };

  // Touch handlers for swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;
    const diff = touchStartX - touchEndX;
    const minSwipe = 55;

    if (diff > minSwipe) {
      handleNext(); // Swipe left -> next image
    } else if (diff < -minSwipe) {
      handlePrev(); // Swipe right -> prev image
    }

    setTouchStartX(null);
    setTouchEndX(null);
  };

  const handleLightboxTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;
    const diff = touchStartX - touchEndX;
    const minSwipe = 55;

    if (diff > minSwipe) {
      handleLightboxNext();
    } else if (diff < -minSwipe) {
      handleLightboxPrev();
    }

    setTouchStartX(null);
    setTouchEndX(null);
  };

  const openLightbox = () => {
    setLightboxIndex(activeIndex);
    setLightboxScale(1);
    setIsLightboxOpen(true);
  };

  if (images.length === 0) {
    return (
      <div className="w-full aspect-square bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400 font-bold border border-slate-200">
        No Images Available
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnail Gallery (Left side on larger screens, horizontal scroll at bottom for mobile) */}
      <div className="flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto max-h-[460px] no-scrollbar py-1 flex-shrink-0">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-2xl bg-white border-2 p-1.5 transition-all duration-300 relative overflow-hidden select-none cursor-pointer flex items-center justify-center ${
              activeIndex === index
                ? "border-[#0A7FE6] shadow-md scale-105"
                : "border-slate-100 hover:border-slate-300"
            }`}
          >
            <img
              src={image}
              alt={`thumbnail-${index}`}
              className="max-w-full max-h-full object-contain"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {/* Main Image Viewport with magnifying glass */}
      <div className="flex-1 relative aspect-square max-w-[460px] mx-auto bg-white border border-slate-100 rounded-3xl p-4 flex items-center justify-center select-none overflow-hidden group">
        
        {/* Gallery Controls */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/95 text-slate-800 flex items-center justify-center shadow-md border border-slate-100 hover:scale-110 active:scale-95 transition-all duration-200 z-10 cursor-pointer"
              aria-label="Previous image"
            >
              <FaChevronLeft size={10} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/95 text-slate-800 flex items-center justify-center shadow-md border border-slate-100 hover:scale-110 active:scale-95 transition-all duration-200 z-10 cursor-pointer"
              aria-label="Next image"
            >
              <FaChevronRight size={10} />
            </button>
          </>
        )}

        {/* Viewport content */}
        <div
          ref={containerRef}
          className="relative w-full h-full flex items-center justify-center cursor-zoom-in overflow-hidden"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={openLightbox}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={activeIndex}
              src={images[activeIndex]}
              alt="Product View"
              className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-[1.02] transition-transform duration-300"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              loading="lazy"
            />
          </AnimatePresence>

          {/* Premium Circular Magnifier Lens overlay (follows cursor) */}
          {lensVisible && (
            <div
              className="absolute w-[140px] h-[140px] rounded-full border-2 border-[#0A7FE6] shadow-xl pointer-events-none bg-no-repeat bg-white hidden md:block"
              style={lensStyle}
            />
          )}
        </div>

        {/* Zoom cue icon */}
        <button
          onClick={openLightbox}
          className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-slate-900/60 hover:bg-slate-900/80 text-white flex items-center justify-center transition shadow-lg cursor-pointer"
          title="Click to Zoom Fullscreen"
        >
          <FaExpand size={12} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 flex gap-1.5 justify-center z-10 pointer-events-none">
          {images.map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full transition-all duration-350 ${
                activeIndex === index ? "w-5 bg-[#0A7FE6]" : "w-1 bg-slate-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* FULL SCREEN LIGHTBOX MODAL */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-[9999] flex flex-col justify-between items-center py-6 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Lightbox Header / Action Bar */}
            <div className="w-full max-w-5xl flex items-center justify-between z-50">
              <div className="text-white/80 text-xs sm:text-sm font-extrabold tracking-wider">
                IMAGE {lightboxIndex + 1} OF {images.length}
              </div>

              {/* Lightbox Actions */}
              <div className="flex items-center gap-3">
                {/* Zoom In */}
                <button
                  onClick={() => setLightboxScale((prev) => Math.min(prev + 0.5, 3))}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center transition border border-white/10 cursor-pointer"
                  title="Zoom In"
                >
                  <FaSearchPlus size={14} />
                </button>
                {/* Zoom Out */}
                <button
                  onClick={() => setLightboxScale((prev) => Math.max(prev - 0.5, 1))}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center transition border border-white/10 cursor-pointer"
                  title="Zoom Out"
                >
                  <FaSearchMinus size={14} />
                </button>
                {/* Close Button */}
                <button
                  onClick={() => setIsLightboxOpen(false)}
                  className="w-10 h-10 rounded-full bg-rose-600 hover:bg-rose-700 active:scale-95 text-white flex items-center justify-center shadow-lg transition cursor-pointer"
                  title="Close Gallery"
                >
                  <FaTimes size={15} />
                </button>
              </div>
            </div>

            {/* Lightbox Main Image Panel */}
            <div 
              className="flex-grow w-full max-w-3xl flex items-center justify-center relative overflow-hidden my-4"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleLightboxTouchEnd}
            >
              {images.length > 1 && (
                <>
                  <button
                    onClick={handleLightboxPrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/10 hover:scale-105 active:scale-95 transition z-50 cursor-pointer"
                  >
                    <FaChevronLeft size={16} />
                  </button>
                  <button
                    onClick={handleLightboxNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/10 hover:scale-105 active:scale-95 transition z-50 cursor-pointer"
                  >
                    <FaChevronRight size={16} />
                  </button>
                </>
              )}

              {/* Animating Image wrapper */}
              <div className="w-full h-full flex items-center justify-center overflow-auto p-4">
                <motion.img
                  key={lightboxIndex}
                  src={images[lightboxIndex]}
                  alt="Enlarged View"
                  className="max-h-full max-w-full object-contain transition-transform duration-300 origin-center select-none"
                  style={{ transform: `scale(${lightboxScale})` }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25 }}
                />
              </div>
            </div>

            {/* Lightbox Footer Thumbnails */}
            <div className="w-full max-w-3xl flex gap-2 justify-center overflow-x-auto py-2 z-50">
              {images.map((image, idx) => (
                <button
                  key={idx}
                  onClick={() => { setLightboxIndex(idx); setLightboxScale(1); }}
                  className={`w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 rounded-xl bg-white/10 p-1 border-2 transition select-none cursor-pointer flex items-center justify-center ${
                    lightboxIndex === idx ? "border-[#0A7FE6] bg-white/20 scale-105" : "border-transparent hover:border-white/30"
                  }`}
                >
                  <img src={image} alt={`lightbox-thumb-${idx}`} className="max-w-full max-h-full object-contain" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductGallery;
