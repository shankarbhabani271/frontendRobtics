import React, { useState, useEffect } from "react";
import { type Specifications } from "../data/mockProducts";
import { 
  FaInfoCircle, FaMicrochip, FaWifi, FaPlug, FaBolt, 
  FaRulerCombined, FaChevronDown, FaChevronRight, FaCopy, 
  FaPrint, FaFilePdf, FaSearch 
} from "react-icons/fa";
import Swal from "sweetalert2";

interface ProductSpecificationsProps {
  specifications: Specifications;
}

const getCategoryIcon = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes("general") || cat.includes("info")) return <FaInfoCircle className="text-[#0A7FE6] text-sm flex-shrink-0" />;
  if (cat.includes("processor") || cat.includes("ram") || cat.includes("chip") || cat.includes("propulsion")) return <FaMicrochip className="text-[#0A7FE6] text-sm flex-shrink-0" />;
  if (cat.includes("connect") || cat.includes("wireless") || cat.includes("wifi")) return <FaWifi className="text-[#0A7FE6] text-sm flex-shrink-0" />;
  if (cat.includes("port") || cat.includes("interface") || cat.includes("electronics") || cat.includes("plug")) return <FaPlug className="text-[#0A7FE6] text-sm flex-shrink-0" />;
  if (cat.includes("power") || cat.includes("battery") || cat.includes("voltage") || cat.includes("current") || cat.includes("perf") || cat.includes("operation") || cat.includes("flight")) return <FaBolt className="text-[#0A7FE6] text-sm flex-shrink-0" />;
  if (cat.includes("dimension") || cat.includes("weight") || cat.includes("size") || cat.includes("measure") || cat.includes("spec")) return <FaRulerCombined className="text-[#0A7FE6] text-sm flex-shrink-0" />;
  return <FaInfoCircle className="text-[#0A7FE6] text-sm flex-shrink-0" />;
};

const ProductSpecifications: React.FC<ProductSpecificationsProps> = ({ specifications }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const categories = Object.keys(specifications);

  // Initialize expanded state on mount or change
  useEffect(() => {
    if (categories.length > 0) {
      // First one open by default, rest closed
      const initial: Record<string, boolean> = {};
      categories.forEach((cat, idx) => {
        initial[cat] = idx === 0;
      });
      setExpanded(initial);
    }
  }, [specifications]);

  // Expand categories matching the search query
  useEffect(() => {
    if (searchQuery.trim() !== "") {
      const autoExpand: Record<string, boolean> = {};
      categories.forEach((cat) => {
        const items = specifications[cat];
        const match = Object.entries(items).some(([k, v]) => 
          k.toLowerCase().includes(searchQuery.toLowerCase()) || 
          String(v).toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (match) {
          autoExpand[cat] = true;
        }
      });
      setExpanded((prev) => ({ ...prev, ...autoExpand }));
    }
  }, [searchQuery, specifications]);

  const toggleCategory = (category: string) => {
    setExpanded((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleCopySpecs = () => {
    let copyText = "";
    Object.entries(specifications).forEach(([category, items]) => {
      copyText += `${category.toUpperCase()}\n`;
      Object.entries(items).forEach(([key, val]) => {
        copyText += `  - ${key}: ${val}\n`;
      });
      copyText += "\n";
    });

    navigator.clipboard.writeText(copyText).then(() => {
      Swal.fire({
        title: "Copied!",
        text: "Product specifications copied to clipboard.",
        icon: "success",
        toast: true,
        position: "top-end",
        timer: 2500,
        showConfirmButton: false
      });
    });
  };

  const handleDownloadPDF = () => {
    let textContent = "SAKROBOTIX STORE - PRODUCT SPECIFICATIONS\n";
    textContent += "========================================\n\n";
    
    Object.entries(specifications).forEach(([category, items]) => {
      textContent += `[${category.toUpperCase()}]\n`;
      Object.entries(items).forEach(([key, val]) => {
        textContent += `${key.padEnd(25)}: ${val}\n`;
      });
      textContent += "\n";
    });
    
    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "product-specifications.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    Swal.fire({
      title: "Download Complete",
      text: "Specifications downloaded successfully.",
      icon: "success",
      confirmButtonColor: "#201064"
    });
  };

  const handlePrintSpecs = () => {
    window.print();
  };

  if (categories.length === 0) {
    return (
      <p className="text-slate-500 text-xs font-semibold leading-relaxed">
        No technical specifications listed for this product.
      </p>
    );
  }

  // Filter specifications by search query
  const filteredSpecsEntries = Object.entries(specifications).reduce((acc, [category, items]) => {
    const matchedItems = Object.entries(items).filter(([key, val]) => 
      key.toLowerCase().includes(searchQuery.toLowerCase()) || 
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (matchedItems.length > 0) {
      acc.push([category, Object.fromEntries(matchedItems)]);
    }
    return acc;
  }, [] as Array<[string, Record<string, string>]>);

  return (
    <div className="space-y-4">
      
      {/* Search Bar & Action Buttons Controls */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center bg-slate-50 p-3 rounded-2xl border border-slate-100 print:hidden">
        
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search specifications (e.g. RAM, Size)"
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs font-semibold text-[#201064] focus:outline-none focus:ring-2 focus:ring-[#0A7FE6] transition"
          />
        </div>

        {/* Action Panel */}
        <div className="flex gap-2 items-center text-xs font-bold">
          <button
            onClick={handleCopySpecs}
            className="flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 px-3 py-2 rounded-xl active:scale-95 transition cursor-pointer shadow-sm"
            title="Copy specifications as text"
          >
            <FaCopy className="text-[#0A7FE6]" size={11} />
            <span>Copy</span>
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 px-3 py-2 rounded-xl active:scale-95 transition cursor-pointer shadow-sm"
            title="Download Specifications text sheet"
          >
            <FaFilePdf className="text-red-500" size={11} />
            <span>PDF</span>
          </button>
          <button
            onClick={handlePrintSpecs}
            className="flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 px-3 py-2 rounded-xl active:scale-95 transition cursor-pointer shadow-sm"
            title="Print specifications sheet"
          >
            <FaPrint className="text-[#201064]" size={11} />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Accordion Categories Group */}
      <div className="space-y-2">
        {filteredSpecsEntries.length === 0 ? (
          <p className="text-center text-slate-400 text-xs font-semibold py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            No specifications matched your search term "{searchQuery}".
          </p>
        ) : (
          filteredSpecsEntries.map(([category, items]) => {
            const keys = Object.keys(items);
            const isOpen = !!expanded[category];

            return (
              <div 
                key={category} 
                className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm hover:border-slate-200 transition duration-300"
              >
                {/* Accordion Category Header Button */}
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full bg-slate-50/50 px-4 py-3 hover:bg-slate-50 flex items-center justify-between text-left transition select-none cursor-pointer border-b border-transparent data-[open=true]:border-slate-100"
                  data-open={isOpen}
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-2.5">
                    {getCategoryIcon(category)}
                    <span className="text-[#201064] font-black text-xs uppercase tracking-wider">
                      {category}
                    </span>
                  </div>
                  <div className="text-slate-400">
                    {isOpen ? <FaChevronDown size={10} /> : <FaChevronRight size={10} />}
                  </div>
                </button>

                {/* Collapsible Accordion Table Body */}
                {isOpen && (
                  <div className="divide-y divide-slate-100 bg-white">
                    {keys.map((key) => (
                      <div
                        key={key}
                        className="grid grid-cols-1 sm:grid-cols-3 p-3.5 sm:py-2.5 sm:px-5 text-xs font-semibold hover:bg-slate-50/30 transition duration-200 gap-1 sm:gap-4"
                      >
                        {/* Parameter Label (Left) */}
                        <span className="text-slate-400 font-extrabold uppercase text-[10px] tracking-wider flex-shrink-0 sm:col-span-1 self-center">
                          {key}
                        </span>
                        {/* Parameter Value (Right) */}
                        <span className="text-slate-700 sm:col-span-2 font-bold text-xs self-center">
                          {items[key]}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

export default ProductSpecifications;
