import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { mockProducts } from "../../data/mockProducts";
import {
  FaShoppingCart,
  FaHeart,
  FaStar,
  FaEye,
} from "react-icons/fa";
import Swal from "sweetalert2";

interface ProductCardProps {
  id: string;
  image: string;
  name: string;
  price: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  image,
  name,
  price,
}) => {
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useApp();
  
  const product = mockProducts.find((p) => p.id === id);
  const isWishlisted = isInWishlist(id);

  const handleViewDetails = () => {
    navigate(`/product/${id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product) {
      addToCart(product, 1);
      Swal.fire({
        title: "Added to Cart!",
        text: `${name} successfully added to your cart.`,
        icon: "success",
        toast: true,
        position: "top-end",
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(id);
  };

  return (
    <div 
      onClick={handleViewDetails}
      className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col justify-between h-full"
    >
      <div>
        {/* Product Image */}
        <div className="h-[260px] bg-white flex items-center justify-center p-6 overflow-hidden relative">
          <img
            src={image}
            alt={name}
            className="max-h-full object-contain group-hover:scale-105 transition duration-300"
            loading="lazy"
          />
          {product?.discount && (
            <span className="absolute top-3 left-3 bg-[#e11d48] text-white font-bold text-xs px-2.5 py-1 rounded-full shadow-sm">
              {product.discount}% OFF
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <span className="text-xs uppercase font-bold text-indigo-600 tracking-wider">
            {product?.brand || "SAKROBOTIX"}
          </span>
          <h3 className="text-[#201064] text-base font-medium leading-6 min-h-[50px] mt-1 line-clamp-2 hover:text-indigo-800 transition">
            {name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex text-yellow-400 text-sm">
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar className={product && product.rating >= 4.5 ? "text-yellow-400" : "text-gray-300"} />
            </div>
            <span className="text-xs text-slate-500 font-semibold">
              ({product?.reviewCount || 100})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mt-3">
            <h4 className="text-xl font-bold text-[#201064]">
              ₹{price}
            </h4>
            {product?.originalPrice && (
              <span className="text-sm line-through text-slate-400">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-[60px_1fr_1fr] border-t border-slate-100 rounded-b-2xl overflow-hidden mt-auto">
        
        {/* Wishlist */}
        <button 
          onClick={handleWishlist}
          className={`py-3.5 flex items-center justify-center transition border-r border-slate-100 ${
            isWishlisted 
              ? "bg-rose-50 text-rose-600 hover:bg-rose-100" 
              : "bg-white text-slate-400 hover:bg-slate-50 hover:text-slate-600"
          }`}
        >
          <FaHeart className={isWishlisted ? "scale-110 text-rose-600" : ""} />
        </button>

        {/* Add To Cart */}
        <button 
          onClick={handleAddToCart}
          className="bg-[#0A7FE6] text-white py-3.5 flex items-center justify-center gap-2 hover:bg-[#0866b8] transition-all duration-300 cursor-pointer border-r border-slate-100 font-bold text-xs"
        >
          <FaShoppingCart size={12} />
          <span>Add to Cart</span>
        </button>

        {/* View */}
        <button 
          onClick={handleViewDetails}
          className="bg-[#201064] text-white py-3.5 flex items-center justify-center gap-2 hover:bg-[#0A7FE6] transition-all duration-300 cursor-pointer font-bold text-xs"
        >
          <FaEye size={12} />
          <span>View</span>
        </button>

      </div>
    </div>
  );
};

export default ProductCard;