import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../context/AppContext";
import { type Product } from "../data/mockProducts";
import {
  FaStar,
  FaHeart,
  FaShoppingCart,
  FaChevronLeft,
  FaChevronRight,
  FaEye,
} from "react-icons/fa";
import Swal from "sweetalert2";

interface ProductCardProps {
  product: Product & {
    _id?: string;
    image?: string;
    badgeText?: string;
    cartButtonText?: string;
    viewButtonText?: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist, addToCart } = useApp();

  const prodId = product.id || product._id || "";
  const isWishlisted = isInWishlist(prodId);

  const imagesList =
    product.images && product.images.length > 0
      ? product.images
      : [
          product.image ||
            "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=600&q=80",
        ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  // Auto-cycle images on hover
  useEffect(() => {
    if (!isHovered || imagesList.length <= 1) {
      setCurrentImageIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % imagesList.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [isHovered, imagesList.length]);

  const handleCardClick = () => navigate(`/products/${prodId}`);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(prodId);
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product as any, 1);
    Swal.fire({
      title: "Added to Cart!",
      text: `${product.name} successfully added to your cart.`,
      icon: "success",
      toast: true,
      position: "top-end",
      timer: 2000,
      showConfirmButton: false
    });
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? imagesList.length - 1 : prev - 1
    );
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % imagesList.length);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance)
      setCurrentImageIndex((prev) => (prev + 1) % imagesList.length);
    if (distance < -minSwipeDistance)
      setCurrentImageIndex((prev) =>
        prev === 0 ? imagesList.length - 1 : prev - 1
      );
    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentImageIndex(0);
      }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-400 group cursor-pointer flex flex-col hover:-translate-y-1 transform relative overflow-hidden h-full min-h-[380px] sm:min-h-[440px] justify-between"
    >
      {/* ── IMAGE AREA ── */}
      <div className="relative h-[180px] sm:h-[220px] bg-white flex items-center justify-center p-4 sm:p-6 overflow-hidden rounded-t-2xl">
      {/* Badge: custom text OR auto-discount badge */}
        {(product.badgeText || product.discount > 0) && (
          <span className="absolute top-3.5 left-3.5 bg-[#E91E63] text-white font-bold text-[10px] px-2.5 py-1 rounded-full shadow-sm z-10 uppercase tracking-wide">
            {product.badgeText ? product.badgeText : `${product.discount}% OFF`}
          </span>
        )}

        {/* Product image with animation */}
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            src={imagesList[currentImageIndex]}
            alt={product.name}
            initial={{ opacity: 0, scale: 0.93 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.93 }}
            transition={{ duration: 0.25 }}
            className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </AnimatePresence>

        {/* Chevron prev/next — visible on hover */}
        {imagesList.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 text-slate-700 flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-[#0A7FE6] hover:text-white z-20"
            >
              <FaChevronLeft size={11} />
            </button>
            <button
              type="button"
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 text-slate-700 flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-[#0A7FE6] hover:text-white z-20"
            >
              <FaChevronRight size={11} />
            </button>
          </>
        )}

        {/* Dot indicators */}
        {imagesList.length > 1 && (
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10">
            {imagesList.map((_, idx) => (
              <div
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(idx);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentImageIndex === idx
                    ? "w-5 bg-[#0A7FE6]"
                    : "w-1.5 bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>
        )}
        

      </div>

      {/* ── CONTENT AREA ── */}
      <div className="px-5 pt-3 pb-4 flex flex-col gap-1.5 flex-grow">
        {/* Brand */}
        <span className="text-[10px] uppercase font-extrabold tracking-wider text-[#4B3EC4]">
          {product.brand || "SAKROBOTIX"}
        </span>

        {/* Product name */}
        <h3 className="text-[#201064] text-sm sm:text-[15px] font-bold leading-snug line-clamp-2 min-h-[40px] sm:min-h-[42px] group-hover:text-[#0A7FE6] transition-colors duration-200">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-0.5">
          <div className="flex items-center gap-0.5 text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                size={11}
                className={
                  i < Math.floor(product.rating || 5)
                    ? "text-yellow-400"
                    : "text-slate-200"
                }
              />
            ))}
          </div>
          <span className="text-xs text-slate-400 font-medium">
            ({product.reviewCount || 0})
          </span>
        </div>

        {/* Price row */}
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-lg font-extrabold text-[#201064]">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-xs line-through text-slate-400 font-medium">
              ₹{product.originalPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>
      </div>

      {/* ── BUTTON ROW — always visible ── */}
      <div className="grid grid-cols-[48px_1fr_1fr] sm:grid-cols-[60px_1fr_1fr] gap-0 border-t border-slate-100 rounded-b-2xl overflow-hidden mt-auto">
        {/* WISHLIST button */}
        <button
          type="button"
          onClick={handleWishlistClick}
          className={`flex items-center justify-center py-3.5 transition-all duration-300 cursor-pointer border-r border-slate-100 ${
            isWishlisted
              ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
              : "bg-white text-slate-400 hover:bg-slate-50 hover:text-slate-600"
          }`}
        >
          <FaHeart size={14} className={isWishlisted ? "text-rose-600 scale-110" : ""} />
        </button>

        {/* ADD TO CART button */}
        <button
          type="button"
          onClick={handleAddToCartClick}
          className="flex items-center justify-center gap-2 py-3.5 bg-[#0A7FE6] text-white font-black text-xs hover:bg-[#0866b8] transition-all duration-300 cursor-pointer border-r border-slate-100"
        >
          <FaShoppingCart size={13} />
          <span>{product.cartButtonText || "Add to Cart"}</span>
        </button>

        {/* VIEW button */}
        <button
          type="button"
          onClick={handleCardClick}
          className="flex items-center justify-center gap-2 py-3.5 bg-[#201064] text-white font-black text-xs hover:bg-[#0A7FE6] transition-all duration-300 cursor-pointer"
        >
          <FaEye size={13} />
          <span>{product.viewButtonText || "View"}</span>
        </button>
      </div>


    </div>
  );
};

export default ProductCard;
