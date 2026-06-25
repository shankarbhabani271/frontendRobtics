import React from "react";
import ProductCard from "./ProductCard";
import { type Product } from "../data/mockProducts";
import { motion } from "framer-motion";

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

// Premium Skeleton Loader for Product Cards
export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between h-[420px] animate-pulse">
      <div>
        <div className="h-[220px] bg-slate-100 w-full" />
        <div className="p-5 space-y-3">
          <div className="h-3 bg-slate-100 rounded w-1/4" />
          <div className="h-4 bg-slate-100 rounded w-3/4" />
          <div className="flex items-center gap-1 mt-2">
            <div className="h-3 bg-slate-100 rounded w-16" />
          </div>
          <div className="h-5 bg-slate-100 rounded w-1/3 mt-3" />
        </div>
      </div>
      <div className="grid grid-cols-[1.2fr_0.8fr_1.2fr] border-t border-slate-100 h-[50px]">
        <div className="bg-slate-50 border-r border-slate-100" />
        <div className="bg-white border-r border-slate-100" />
        <div className="bg-slate-50" />
      </div>
    </div>
  );
};

const ProductGrid: React.FC<ProductGridProps> = ({ products, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
        {[...Array(6)].map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-lg font-bold text-[#201064]">No products found</p>
          <p className="text-sm text-slate-400 mt-1">Try adjusting your filters or choose another category.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
      {products.map((product) => (
        <ProductCard key={product.id || (product as any)._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
