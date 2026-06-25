import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import ProductGrid from "../components/ProductGrid";
import { FaHome, FaChevronRight, FaSlidersH, FaSearch, FaSync } from "react-icons/fa";
import { API_BASE_URL } from "../context/AuthContext";

const Products: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [priceRange, setPriceRange] = useState(200000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("recommended");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Fetch products and categories on mount
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [prodsRes, catsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/content/products`),
        fetch(`${API_BASE_URL}/content/categories`),
      ]);
      if (prodsRes.ok) {
        const data = await prodsRes.json();
        setProducts(Array.isArray(data) ? data : []);
      }
      if (catsRes.ok) {
        const cats = await catsRes.json();
        setCategories(cats.filter((c: any) => c.type === "product" && c.isActive));
      }
    } catch (err) {
      console.error("Failed to fetch products or categories:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // All unique brands from API products
  const allBrands = ["All", ...Array.from(new Set(products.map((p) => p.brand || "Generic").filter(Boolean)))];

  // Client-side filtering and sorting
  const filteredProducts = products
    .filter((p) => {
      const matchSearch =
        !searchQuery ||
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.brand || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory =
        selectedCategory === "All" ||
        p.category === selectedCategory ||
        (p.category || "").toLowerCase().includes(selectedCategory.toLowerCase());
      const matchBrand = selectedBrand === "All" || (p.brand || "Generic") === selectedBrand;
      const matchPrice = p.price <= priceRange;
      const matchStock = !inStockOnly || p.stock > 0;
      return matchSearch && matchCategory && matchBrand && matchPrice && matchStock;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return (b.rating || 5) - (a.rating || 5);
      if (sortBy === "newest") return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      return (a.orderIndex || 0) - (b.orderIndex || 0);
    });

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedBrand("All");
    setPriceRange(200000);
    setInStockOnly(false);
    setSortBy("recommended");
  };

  const CategoryFilterList = ({ mobile = false }) => (
    <div className={mobile ? "space-y-2 max-h-40 overflow-y-auto" : "space-y-2"}>
      <label className="flex items-center gap-2.5 text-sm font-semibold text-slate-600 cursor-pointer">
        <input
          type="radio"
          name={mobile ? "catMobile" : "catDesktop"}
          checked={selectedCategory === "All"}
          onChange={() => setSelectedCategory("All")}
          className="rounded border-slate-300 text-[#0A7FE6] focus:ring-[#0A7FE6] h-4 w-4"
        />
        <span>All Categories</span>
      </label>
      {categories.map((c) => (
        <label key={c._id} className="flex items-center gap-2.5 text-sm font-semibold text-slate-600 cursor-pointer">
          <input
            type="radio"
            name={mobile ? "catMobile" : "catDesktop"}
            checked={selectedCategory === (c.slug || c.name)}
            onChange={() => setSelectedCategory(c.slug || c.name)}
            className="rounded border-slate-300 text-[#0A7FE6] focus:ring-[#0A7FE6] h-4 w-4"
          />
          <span>{c.name}</span>
        </label>
      ))}
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">
          <Link to="/" className="hover:text-[#0A7FE6] flex items-center gap-1">
            <FaHome />
            <span>Home</span>
          </Link>
          <FaChevronRight size={8} />
          <span className="text-[#201064]">Products Catalog</span>
        </div>

        {/* Banner */}
        <div className="bg-[#201064] rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white relative overflow-hidden mb-8 sm:mb-10 shadow-lg">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:45px_45px] opacity-[0.03]" />
          <div className="relative z-10 max-w-xl min-w-0">
            <span className="text-xs font-extrabold uppercase tracking-[4px] text-cyan-400">
              SAKROBOTIX MARKETPLACE
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black mt-3">Full Product Catalog</h1>
            <p className="text-slate-200 mt-2 text-sm leading-relaxed font-semibold max-w-md">
              Browse our inventory of development boards, sensors, drone hardware, and STEM kits.
            </p>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block lg:col-span-1 space-y-6">
            {/* Search Box */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm relative flex items-center">
              <input
                type="text"
                placeholder="Search catalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#0A7FE6] focus:bg-white transition pl-10 pr-4 py-2.5 rounded-xl outline-none text-xs font-bold"
              />
              <FaSearch className="absolute left-9 text-slate-400" size={12} />
            </div>

            {/* Filters Panel */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-150">
                <h3 className="font-black text-sm text-[#201064] flex items-center gap-2 uppercase tracking-wider">
                  <FaSlidersH />
                  <span>Filters</span>
                </h3>
                <button onClick={clearFilters} className="text-xs font-bold text-rose-500 hover:underline cursor-pointer">
                  Clear All
                </button>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-2.5">Category</label>
                <CategoryFilterList />
              </div>

              {/* Brand */}
              <div>
                <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-2.5">Brand</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 px-3 py-2.5 rounded-xl outline-none focus:border-[#0A7FE6] cursor-pointer"
                >
                  {allBrands.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-2.5">
                  Max Price: <span className="text-[#0A7FE6]">â‚¹{priceRange.toLocaleString("en-IN")}</span>
                </label>
                <input
                  type="range" min={50} max={200000} step={500}
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-[#0A7FE6]"
                />
              </div>

              {/* Stock */}
              <div>
                <label className="flex items-center gap-2.5 text-sm font-semibold text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded border-slate-300 text-[#0A7FE6] focus:ring-[#0A7FE6] h-4 w-4"
                  />
                  <span>In Stock Only</span>
                </label>
              </div>
            </div>
          </div>

          {/* Mobile Filter Drawer */}
          {isFilterDrawerOpen && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[999] flex justify-end p-4 overflow-y-auto lg:hidden">
              <div className="bg-white w-full max-w-sm rounded-3xl p-6 relative flex flex-col justify-between shadow-2xl h-fit border border-slate-100 max-h-[90vh]">
                <button
                  type="button"
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition cursor-pointer"
                >
                  <span className="font-extrabold text-sm">âœ•</span>
                </button>

                <div className="space-y-6 overflow-y-auto pr-1 flex-grow">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-150">
                    <h3 className="font-black text-sm text-[#201064] flex items-center gap-2 uppercase tracking-wider">
                      <FaSlidersH /><span>Filters</span>
                    </h3>
                    <button onClick={clearFilters} className="text-xs font-bold text-rose-500 hover:underline cursor-pointer">Clear All</button>
                  </div>

                  {/* Mobile Search */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 relative flex items-center">
                    <input
                      type="text"
                      placeholder="Search catalog..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white border border-slate-200 focus:border-[#0A7FE6] transition pl-9 pr-3 py-2 rounded-xl outline-none text-xs font-bold"
                    />
                    <FaSearch className="absolute left-7 text-slate-400" size={11} />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-2.5">Category</label>
                    <CategoryFilterList mobile />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-2.5">Brand</label>
                    <select
                      value={selectedBrand}
                      onChange={(e) => setSelectedBrand(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 px-3 py-2.5 rounded-xl outline-none focus:border-[#0A7FE6] cursor-pointer"
                    >
                      {allBrands.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-2.5">
                      Max Price: <span className="text-[#0A7FE6]">â‚¹{priceRange.toLocaleString("en-IN")}</span>
                    </label>
                    <input type="range" min={50} max={200000} step={500} value={priceRange}
                      onChange={(e) => setPriceRange(Number(e.target.value))} className="w-full accent-[#0A7FE6]" />
                  </div>

                  <div>
                    <label className="flex items-center gap-2.5 text-sm font-semibold text-slate-600 cursor-pointer">
                      <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)}
                        className="rounded border-slate-300 text-[#0A7FE6] focus:ring-[#0A7FE6] h-4 w-4" />
                      <span>In Stock Only</span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsFilterDrawerOpen(false)}
                    className="w-full bg-[#201064] text-white hover:bg-[#0A7FE6] py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Grid View */}
          <div className="lg:col-span-3 space-y-6">
            {/* Header control bar */}
            <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center justify-between w-full sm:w-auto gap-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  {filteredProducts.length} Products
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={fetchData}
                    title="Refresh products"
                    className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:text-[#201064] hover:bg-slate-100 transition cursor-pointer"
                  >
                    <FaSync size={11} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFilterDrawerOpen(true)}
                    className="lg:hidden flex items-center gap-1.5 px-3.5 py-2 bg-[#201064] text-white rounded-xl text-xs font-bold shadow hover:bg-[#0A7FE6] transition cursor-pointer"
                  >
                    <FaSlidersH size={10} />
                    <span>Filters</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-start">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 px-3 py-2 rounded-xl outline-none focus:border-[#0A7FE6] cursor-pointer"
                >
                  <option value="recommended">Recommended</option>
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            <ProductGrid products={filteredProducts} isLoading={loading} />

            {/* Empty State */}
            {!loading && filteredProducts.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="text-5xl mb-4">ðŸ“¦</div>
                <h3 className="text-xl font-black text-[#201064]">No Products Found</h3>
                <p className="text-slate-500 text-sm mt-2 font-semibold">Try adjusting your search or filters.</p>
                <button onClick={clearFilters} className="mt-6 px-6 py-2.5 bg-[#201064] text-white rounded-xl font-bold text-sm hover:bg-[#0A7FE6] transition cursor-pointer">
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
