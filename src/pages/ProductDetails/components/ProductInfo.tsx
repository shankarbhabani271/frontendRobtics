import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../../context/AppContext";
import type { Product } from "../../../data/mockProducts";
import {
  FaStar,
  FaShoppingCart,
  FaBolt,
  FaHeart,
  FaShareAlt,
  FaExchangeAlt,
} from "react-icons/fa";

interface ProductInfoProps {
  product: Product;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useApp();
  const [isCompared, setIsCompared] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);

  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  const handleBuyNow = () => {
    addToCart(product, 1);
    // Redirect to checkout / cart mockup page or just simulate checkouts
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareTooltip(true);
    setTimeout(() => {
      setShowShareTooltip(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Brand Name */}
      <div>
        <span className="text-sm font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">
          {product.brand}
        </span>
        
        {/* Product Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-[#201064] mt-3 leading-snug">
          {product.name}
        </h1>
      </div>

      {/* Ratings & Reviews Badges */}
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <div className="flex items-center gap-1.5 bg-emerald-600 text-white font-bold px-2.5 py-1 rounded text-xs">
          <span>{product.rating}</span>
          <FaStar size={10} />
        </div>
        <span className="text-slate-500 font-semibold">
          {product.reviewCount.toLocaleString()} Ratings & {Math.floor(product.reviewCount * 0.35)} Reviews
        </span>
        <span className="text-slate-300">|</span>
        <span className="text-slate-500">
          100% Verified Purchases
        </span>
      </div>

      {/* Pricing Information */}
      <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-100">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl sm:text-4xl font-extrabold text-[#201064]">
            ₹{product.price.toLocaleString()}
          </span>
          <span className="text-base line-through text-slate-400">
            ₹{product.originalPrice.toLocaleString()}
          </span>
          <span className="text-lg font-bold text-emerald-600">
            {product.discount}% OFF
          </span>
        </div>
        
        {/* Availability Badge */}
        <div className="mt-3 flex items-center gap-2">
          <span className={`inline-block w-2.5 h-2.5 rounded-full ${product.inStock ? "bg-emerald-500" : "bg-rose-500"}`}></span>
          <span className={`text-sm font-bold ${product.inStock ? "text-emerald-700" : "text-rose-700"}`}>
            {product.inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      </div>

      {/* Action Buttons (Flipkart/Amazon Conversion Colors) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={`flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl font-bold text-white shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer text-base uppercase bg-[#ff9f00] hover:bg-[#e68f00] ${
            !product.inStock ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <FaShoppingCart size={18} />
          Add To Cart
        </button>

        {/* Buy Now Button */}
        <button
          onClick={handleBuyNow}
          disabled={!product.inStock}
          className={`flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl font-bold text-white shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer text-base uppercase bg-[#fb641b] hover:bg-[#e05615] ${
            !product.inStock ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <FaBolt size={18} />
          Buy Now
        </button>

      </div>

      {/* Utility Actions Grid */}
      <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-100">
        
        {/* Wishlist Toggle Button */}
        <button
          onClick={() => toggleWishlist(product.id)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border font-semibold text-sm transition-all duration-200 cursor-pointer ${
            isWishlisted
              ? "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-800"
          }`}
        >
          <FaHeart className={isWishlisted ? "fill-rose-600 scale-105" : ""} />
          {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
        </button>

        {/* Share Button with dynamic tooltip popup */}
        <div className="relative">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-800 font-semibold text-sm transition-all duration-200 cursor-pointer"
          >
            <FaShareAlt />
            Share Product
          </button>
          
          {showShareTooltip && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#201064] text-white text-xs px-3 py-1.5 rounded-md shadow-lg font-medium whitespace-nowrap animate-bounce z-10">
              Copied Link!
            </div>
          )}
        </div>

        {/* Compare Button */}
        <button
          onClick={() => setIsCompared(!isCompared)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border font-semibold text-sm transition-all duration-200 cursor-pointer ${
            isCompared
              ? "border-indigo-200 bg-indigo-50 text-indigo-600"
              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-800"
          }`}
        >
          <FaExchangeAlt />
          {isCompared ? "Added to Compare" : "Compare Product"}
        </button>

      </div>

      {/* Delivery Information Section */}
      <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-2">
        <h3 className="font-bold text-sm text-[#201064] uppercase tracking-wider">
          Delivery Details
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          {product.deliveryInfo}
        </p>
        <p className="text-xs text-slate-500 font-medium">
          COD available on orders above ₹500. Cash on delivery limit is ₹3,000.
        </p>
      </div>

      {/* Highlights Section */}
      <div className="space-y-3">
        <h3 className="font-bold text-[#201064] text-base">
          Product Highlights
        </h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600 pl-4 list-disc marker:text-[#201064]">
          {(product.highlights || []).map((highlight, idx) => (
            <li key={idx} className="leading-relaxed">
              {highlight}
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
};

export default ProductInfo;
