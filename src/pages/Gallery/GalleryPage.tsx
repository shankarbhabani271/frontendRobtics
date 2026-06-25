import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "../../components/ProductCard";
import { mockProducts } from "../../data/mockProducts";

const GalleryPage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchProducts = async (pageNum: number, isInitial: boolean) => {
    if (isInitial) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    const limit = 4;
    try {
      const res = await fetch(`http://localhost:8090/api/content/products?page=${pageNum}&limit=${limit}&isFeatured=true&isActive=true`);
      if (res.ok) {
        const data = await res.json();
        const totalHeader = res.headers.get("X-Total-Count");
        const totalCount = totalHeader ? parseInt(totalHeader, 10) : 0;

        setProducts((prev) => {
          const newProducts = isInitial ? data : data.filter(
            (newProd: any) => !prev.some((p) => (p._id || p.id) === (newProd._id || newProd.id))
          );
          const updatedProducts = isInitial ? data : [...prev, ...newProducts];
          
          const hasMoreProducts = data.length === limit && (totalCount > 0 ? updatedProducts.length < totalCount : true);
          setHasMore(hasMoreProducts);
          return updatedProducts;
        });

        if (isInitial) setLoading(false);
        else setLoadingMore(false);
        return;
      }
    } catch (err) {
      console.error("Failed to fetch featured products dynamically, falling back...", err);
    }

    // Fallback using mockProducts
    const allFallback = mockProducts.map((p, idx) => ({ 
      ...p, 
      _id: p.id, 
      isFeatured: true, 
      isActive: true, 
      orderIndex: idx 
    }));
    
    const startIndex = (pageNum - 1) * limit;
    const pageProducts = allFallback.slice(startIndex, startIndex + limit);
    const totalCount = allFallback.length;

    setProducts((prev) => {
      const newProducts = isInitial ? pageProducts : pageProducts.filter(
        (newProd: any) => !prev.some((p) => (p._id || p.id) === (newProd._id || newProd.id))
      );
      const updatedProducts = isInitial ? pageProducts : [...prev, ...newProducts];
      const hasMoreProducts = pageProducts.length === limit && updatedProducts.length < totalCount;
      setHasMore(hasMoreProducts);
      return updatedProducts;
    });

    if (isInitial) setLoading(false);
    else setLoadingMore(false);
  };

  useEffect(() => {
    fetchProducts(1, true);
  }, []);

  const handleLoadMore = () => {
    if (loadingMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage, false);
  };

  if (loading) {
    return (
      <div className="py-20 bg-slate-50 flex items-center justify-center min-h-[400px]">
        <div className="text-center text-slate-500 font-bold">
          Loading Showcase Gallery...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12 bg-slate-50 min-h-screen">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs uppercase font-extrabold tracking-[4px] text-[#0A7FE6] block mb-2.5">
          SAKROBOTIX EXHIBIT
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#201064]">
          Featured Product Gallery
        </h1>
        {/* Underline */}
        <div className="w-16 h-1 bg-[#201064] mx-auto mt-4 rounded-full" />
        <p className="text-slate-500 text-sm mt-4 font-medium leading-relaxed">
          Explore our collection of cutting-edge robotics platforms, drone solutions, and custom development boards. Hand-selected for innovation and performance.
        </p>
      </div>

      {/* Grid of Product Cards */}
      <div className="space-y-8">
        
        <motion.div 
          layout
          className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {products.map((product) => (
              <motion.div
                key={product._id || product.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="h-full"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* View More Button */}
        {hasMore && products.length > 0 && (
          <div className="flex justify-center mt-14">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="inline-flex items-center justify-center bg-[#201064] hover:bg-[#0A7FE6] text-white font-black px-10 py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.97] text-sm tracking-wide cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loadingMore ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </span>
              ) : (
                "View More"
              )}
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default GalleryPage;
