import React, { useState } from "react";
import type { Product } from "../../../data/mockProducts";

interface ProductSpecsProps {
  product: Product;
}

const ProductSpecs: React.FC<ProductSpecsProps> = ({ product }) => {
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "details" | "warranty">("desc");

  const tabs = [
    { id: "desc", label: "Description & Features" },
    { id: "specs", label: "Specifications" },
    { id: "details", label: "Dimensions & Material" },
    { id: "warranty", label: "Warranty" },
  ] as const;

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      
      {/* Tabs Headers */}
      <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-4 font-bold text-sm sm:text-base border-b-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === tab.id
                ? "border-[#201064] text-[#201064] bg-white"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100/50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="p-6">
        
        {/* Description & Key Features */}
        {activeTab === "desc" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-[#201064]">
                Product Description
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                {product.description}
              </p>
            </div>
            
            <div className="space-y-3 border-t border-slate-100 pt-5">
              <h3 className="text-lg font-bold text-[#201064]">
                Key Features
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-slate-600 text-sm sm:text-base leading-relaxed">
                {(product.keyFeatures || []).map((feat, idx) => (
                  <li key={idx}>
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Specifications Table */}
        {activeTab === "specs" && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-lg font-bold text-[#201064]">
              Technical Specifications
            </h3>
            
            <div className="space-y-6">
              {Object.entries(product.specifications || {}).map(([category, items]) => (
                <div key={category} className="space-y-3">
                  <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-wider">
                    {category}
                  </h4>
                  
                  <div className="border border-slate-200 rounded-lg overflow-x-auto">
                    <table className="w-full min-w-[400px] text-sm">
                      <tbody>
                        {Object.entries(items).map(([key, val], idx) => (
                          <tr
                            key={key}
                            className={`border-b border-slate-100 last:border-none ${
                              idx % 2 === 0 ? "bg-white" : "bg-slate-50"
                            }`}
                          >
                            <td className="w-1/3 py-3.5 px-4 font-bold text-slate-500 border-r border-slate-100">
                              {key}
                            </td>
                            <td className="w-2/3 py-3.5 px-4 text-slate-700 font-semibold">
                              {val}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dimensions & Material */}
        {activeTab === "details" && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-lg font-bold text-[#201064]">
              Physical Specifications
            </h3>
            
            <div className="border border-slate-200 rounded-lg overflow-x-auto">
              <table className="w-full min-w-[400px] text-sm">
                <tbody>
                  <tr className="bg-white border-b border-slate-100">
                    <td className="w-1/3 py-3.5 px-4 font-bold text-slate-500 border-r border-slate-100">
                      Dimensions
                    </td>
                    <td className="w-2/3 py-3.5 px-4 text-slate-700 font-semibold">
                      {product.dimensions}
                    </td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="w-1/3 py-3.5 px-4 font-bold text-slate-500 border-r border-slate-100">
                      Material
                    </td>
                    <td className="w-2/3 py-3.5 px-4 text-slate-700 font-semibold">
                      {product.material}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Warranty */}
        {activeTab === "warranty" && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-lg font-bold text-[#201064]">
              Warranty Information
            </h3>
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5">
              <p className="text-indigo-950 font-bold text-base">
                {product.warranty}
              </p>
              <p className="text-indigo-800 text-sm mt-2 leading-relaxed">
                Warranty covers manufacturing defects and failure under standard operating parameters. Physical damage, liquid damage, or damage caused by improper voltage inputs are excluded from warranty coverage.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductSpecs;
