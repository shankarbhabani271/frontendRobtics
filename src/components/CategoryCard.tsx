import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaChevronRight } from "react-icons/fa";

interface CategoryCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  count: number;
  buttonText?: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  id,
  name,
  description,
  image,
  count,
  buttonText,
}) => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate(`/category/${id}`);
  };

  return (
    <motion.div
      onClick={handleNavigation}
      className="relative bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-shadow duration-300 group cursor-pointer flex flex-col justify-between select-none h-full"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -6, scale: 1.02 }}
    >
      {/* Border Glow overlay */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#0A7FE6]/30 rounded-2xl transition-all duration-300 pointer-events-none z-10" />

      <div>
        {/* Category Image container */}
        <div className="h-56 sm:h-64 bg-slate-50 relative overflow-hidden flex items-center justify-center p-5 sm:p-6 border-b border-slate-100/50">
          <motion.img
            src={image}
            alt={name}
            className="max-h-full object-contain filter drop-shadow-md z-0"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            loading="lazy"
          />
          {/* Badge */}
          <span className="absolute top-5 right-5 bg-[#201064] text-white font-black text-xs px-3.5 py-1.5 rounded-full shadow-md z-10 tracking-wider">
            {count} {count === 1 ? "Product" : "Products"}
          </span>
        </div>

        {/* Content */}
        <div className="p-7 sm:p-8 space-y-4">
          <h3 className="text-2xl font-black text-[#201064] group-hover:text-[#0A7FE6] transition-colors duration-300">
            {name}
          </h3>
          <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed font-semibold">
            {description}
          </p>
        </div>
      </div>

      {/* Button footer */}
      <div className="px-7 pb-7 sm:px-8 sm:pb-8 pt-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNavigation();
          }}
          className="w-full flex items-center justify-center gap-2.5 bg-[#201064] hover:bg-[#0A7FE6] text-white py-4 rounded-xl font-black text-sm sm:text-base shadow-md transition-all duration-300 transform group-hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <span>{buttonText || "View Category"}</span>
          <FaChevronRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      </div>
    </motion.div>
  );
};

export default CategoryCard;
