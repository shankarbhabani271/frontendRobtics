import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CategoryCard from "./CategoryCard";
import { API_BASE_URL } from "../context/AuthContext";

const ShopByCategory: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/categories`);
        if (res.ok) {
          const data = await res.json();
          // Filter categories that are active and marked for display on the homepage, sorted by displayOrder
          const homeCategories = data
            .filter((c: any) => c.isActive && c.showOnHomepage)
            .sort((a: any, b: any) => (a.displayOrder || 0) - (b.displayOrder || 0));
          
          setCategories(homeCategories);
        }
      } catch (err) {
        console.error("Failed to fetch home categories", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs uppercase font-extrabold tracking-[4px] text-[#0A7FE6] block mb-2.5">
              SAKROBOTIX STORE
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#201064]">
              Shop By Category
            </h2>
            <div className="w-16 h-1 bg-[#201064] mx-auto mt-4 rounded-full" />
          </div>

          {/* Skeleton Loaders */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4 animate-pulse">
                <div className="h-60 bg-slate-100 rounded-xl w-full" />
                <div className="h-6 bg-slate-100 rounded w-1/2" />
                <div className="h-4 bg-slate-100 rounded w-5/6" />
                <div className="h-12 bg-slate-100 rounded-xl w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // If no categories display, don't show the section
  if (categories.length === 0) {
    return null;
  }

  return (
    <section id="shop-by-category" className="py-12 sm:py-20 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase font-extrabold tracking-[4px] text-[#0A7FE6] block mb-2.5">
            SAKROBOTIX STORE
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#201064]">
            Shop By Category
          </h2>

          {/* Animated Underline */}
          <div className="w-16 h-1 bg-gradient-to-r from-[#201064] via-[#0A7FE6] to-[#E91E63] mx-auto mt-4 rounded-full" />
        </div>

        {/* Categories Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, index) => (
            <motion.div
              key={cat._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <CategoryCard
                id={cat.slug || cat._id}
                name={cat.name}
                description={cat.description || `Explore our complete range of ${cat.name} products.`}
                image={cat.image || "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=600&q=80"}
                count={cat.productCount || 0}
                buttonText={cat.buttonText}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;
