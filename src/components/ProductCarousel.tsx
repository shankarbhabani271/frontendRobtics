import React, { useRef } from "react";
import { type Product } from "../data/mockProducts";
import ProductCard from "./ProductCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface ProductCarouselProps {
  products: Product[];
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ products = [] }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const cardWidth = 280 + 24; // Card width + gap
      const scrollAmount = direction === "left"
        ? scrollLeft - Math.max(cardWidth, clientWidth - 50)
        : scrollLeft + Math.max(cardWidth, clientWidth - 50);

      scrollContainerRef.current.scrollTo({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full group">
      {/* Scrollable container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth py-4 px-2 select-none"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="w-[280px] sm:w-[290px] flex-shrink-0"
            style={{ scrollSnapAlign: "start" }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Control Buttons */}
      {products.length > 1 && (
        <>
          <button
            onClick={() => scroll("left")}
            className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white text-slate-800 hover:text-[#0A7FE6] shadow-lg border border-slate-150 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <FaChevronLeft size={14} />
          </button>

          <button
            onClick={() => scroll("right")}
            className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white text-slate-800 hover:text-[#0A7FE6] shadow-lg border border-slate-150 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <FaChevronRight size={14} />
          </button>
        </>
      )}
    </div>
  );
};

export default ProductCarousel;
