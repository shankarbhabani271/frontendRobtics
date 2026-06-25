import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { mockCategories } from "../data/mockProducts";
import CategoryCard from "../components/CategoryCard";
import { API_BASE_URL } from "../context/AuthContext";

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/categories`);
        if (res.ok) {
          const data = await res.json();
          const activeCategories = data.filter((cat: any) => cat.isActive);
          const formatted = activeCategories.map((cat: any) => ({
            id: cat.slug || cat._id,
            name: cat.name,
            description: cat.description || `Explore our complete range of ${cat.name} products.`,
            image: cat.image || "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=600&q=80",
            count: cat.productCount || 0,
            buttonText: cat.buttonText,
          }));
          if (formatted.length > 0) {
            setCategories(formatted);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error("Failed to fetch categories dynamically", err);
      }
      setCategories(mockCategories);
      setLoading(false);
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="text-center text-slate-500 font-bold">
          Loading Categories...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            className="text-xs uppercase font-extrabold tracking-[4px] text-[#0A7FE6] block mb-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            SAKROBOTIX STORE
          </motion.span>

          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl font-black text-[#201064]"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Shop by Categories
          </motion.h1>

          {/* Animated Underline */}
          <motion.div
            className="h-1.5 bg-gradient-to-r from-[#201064] via-[#0A7FE6] to-[#E91E63] mx-auto mt-4 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: 120 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          />

          <motion.p
            className="mt-6 text-slate-500 font-medium text-sm sm:text-base leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Explore our complete range of robotics, IoT, drone, automation, AI, embedded systems, sensors, and electronic products designed for students, engineers, innovators, researchers, and makers.
          </motion.p>
        </div>

        {/* Category Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <CategoryCard
                id={category.id}
                name={category.name}
                description={category.description}
                image={category.image}
                count={category.count}
                buttonText={category.buttonText}
              />
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Categories;
