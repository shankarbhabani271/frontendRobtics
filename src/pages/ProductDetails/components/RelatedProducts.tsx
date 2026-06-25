import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { type Product, mockProducts } from "../../../data/mockProducts";
import { FaChevronLeft, FaChevronRight, FaStar, FaHeart } from "react-icons/fa";
import { useApp } from "../../../context/AppContext";

interface RelatedProductsProps {
  currentProductId: string;
  category?: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ currentProductId }) => {
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<"similar" | "recommended" | "bought">("similar");
  
  const sliderRef = useRef<HTMLDivElement>(null);

  // Filter products to exclude the current active product
  const baseProducts = mockProducts.filter((p) => p.id !== currentProductId);

  // Generate lists dynamically for different tabs to look rich and realistic
  const getTabProducts = (): Product[] => {
    switch (activeSubTab) {
      case "similar":
        // Products from the same brand or related categories
        return baseProducts;
      case "recommended":
        // Sort or filter differently to show recommendation variance
        return [...baseProducts].reverse();
      case "bought":
        // Frequently bought together (typically cheaper accessory items)
        return baseProducts.slice(0, 3);
      default:
        return baseProducts;
    }
  };

  const currentList = getTabProducts();

  const handleScroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth } = sliderRef.current;
      const scrollAmount = clientWidth * 0.8;
      const newScrollLeft =
        direction === "left"
          ? scrollLeft - scrollAmount
          : scrollLeft + scrollAmount;

      sliderRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  const handleProductClick = (id: string) => {
    navigate(`/product/${id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      
      {/* Tab Switcher Headers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-none py-1">
          <button
            onClick={() => setActiveSubTab("similar")}
            className={`px-4 py-2 text-sm font-bold rounded-full cursor-pointer transition ${
              activeSubTab === "similar"
                ? "bg-[#201064] text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Similar Products
          </button>
          
          <button
            onClick={() => setActiveSubTab("recommended")}
            className={`px-4 py-2 text-sm font-bold rounded-full cursor-pointer transition ${
              activeSubTab === "recommended"
                ? "bg-[#201064] text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Recommended Products
          </button>

          <button
            onClick={() => setActiveSubTab("bought")}
            className={`px-4 py-2 text-sm font-bold rounded-full cursor-pointer transition ${
              activeSubTab === "bought"
                ? "bg-[#201064] text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Frequently Bought Together
          </button>
        </div>

        {/* Navigation Arrows for Slider */}
        {currentList.length > 0 && (
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => handleScroll("left")}
              className="bg-white border border-slate-200 text-[#201064] hover:bg-slate-50 p-2.5 rounded-full shadow-sm hover:shadow transition cursor-pointer"
            >
              <FaChevronLeft size={12} />
            </button>
            <button
              onClick={() => handleScroll("right")}
              className="bg-white border border-slate-200 text-[#201064] hover:bg-slate-50 p-2.5 rounded-full shadow-sm hover:shadow transition cursor-pointer"
            >
              <FaChevronRight size={12} />
            </button>
          </div>
        )}
      </div>

      {/* Slider Carousel Container */}
      <div className="relative">
        
        {currentList.length === 0 ? (
          <p className="text-sm text-slate-400 py-8 text-center">
            No related products found in this category.
          </p>
        ) : (
          <div
            ref={sliderRef}
            className="flex gap-5 overflow-x-auto scroll-smooth pb-4 px-1 scrollbar-thin select-none snap-x"
          >
            {currentList.map((prod) => {
              const wishlisted = isInWishlist(prod.id);
              return (
                <div
                  key={prod.id}
                  onClick={() => handleProductClick(prod.id)}
                  className="w-[230px] sm:w-[260px] flex-shrink-0 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer snap-start flex flex-col justify-between"
                >
                  <div>
                    {/* Image */}
                    <div className="h-[180px] bg-white flex items-center justify-center p-4 border-b border-slate-100 overflow-hidden relative">
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        className="max-h-full object-contain group-hover:scale-105 transition duration-300"
                        loading="lazy"
                      />
                      
                      {/* Heart Toggle */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(prod.id);
                        }}
                        className={`absolute top-2.5 right-2.5 p-2 rounded-full border shadow-sm transition ${
                          wishlisted
                            ? "bg-rose-50 border-rose-100 text-rose-500 hover:bg-rose-100"
                            : "bg-white/80 border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-white"
                        }`}
                      >
                        <FaHeart size={12} />
                      </button>

                      {prod.discount && (
                        <span className="absolute top-2.5 left-2.5 bg-[#e11d48] text-white font-bold text-[10px] px-2 py-0.5 rounded-full">
                          {prod.discount}% OFF
                        </span>
                      )}
                    </div>

                    {/* Meta Info */}
                    <div className="p-4 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {prod.brand}
                      </span>
                      <h4 className="text-slate-800 text-sm font-semibold leading-5 line-clamp-2 min-h-[40px] group-hover:text-[#201064] transition">
                        {prod.name}
                      </h4>
                      
                      {/* Rating summary */}
                      <div className="flex items-center gap-1.5">
                        <div className="flex text-yellow-400 text-xs">
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaStar className={prod.rating >= 4.5 ? "text-yellow-400" : "text-gray-200"} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">
                          ({prod.reviewCount})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing row */}
                  <div className="p-4 pt-0 flex items-baseline justify-between border-t border-slate-50 mt-3">
                    <span className="text-base font-extrabold text-[#201064]">
                      ₹{prod.price.toLocaleString()}
                    </span>
                    <span className="text-xs line-through text-slate-400 font-semibold">
                      ₹{prod.originalPrice.toLocaleString()}
                    </span>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
};

export default RelatedProducts;
