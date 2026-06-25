import React, { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";

interface ScrollToTopButtonProps {
  tooltipText?: string;
}

const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({
  tooltipText = "Scroll to top",
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button if scrolled past 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      className={`fixed bottom-[100px] right-6 z-[9999] group transition-all duration-500 ease-in-out ${
        isVisible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      {/* Tooltip */}
      <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-3 py-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-semibold rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap hidden md:block border border-transparent dark:border-slate-200">
        <div className="relative">
          {tooltipText}
          {/* Tooltip Arrow */}
          <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 border-y-4 border-y-transparent border-l-4 border-l-slate-900 dark:border-l-white w-0 h-0"></div>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={scrollToTop}
        aria-label={tooltipText}
        className="relative flex items-center justify-center w-14 h-14 bg-[#201064] hover:bg-[#0A7FE6] border-2 border-[#0A7FE6] text-white rounded-full shadow-md hover:shadow-lg transform hover:scale-110 active:scale-95 transition-all duration-300 ease-out focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2 dark:focus:ring-offset-slate-900 cursor-pointer"
      >
        <FaArrowUp
          size={18}
          className="text-white transition-transform duration-300 group-hover:-translate-y-1"
        />
      </button>
    </div>
  );
};

export default ScrollToTopButton;
