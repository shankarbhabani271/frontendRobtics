import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { mockCategories, mockProducts } from "../data/mockProducts";
import ProductGrid from "../components/ProductGrid";
import { FaHome, FaChevronRight, FaSlidersH, FaSortAmountDown } from "react-icons/fa";
import { API_BASE_URL } from "../context/AuthContext";

const CategoryProducts: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [loading, setLoading] = useState(true);
  
  // Dynamic MongoDB state
  const [products, setProducts] = useState<any[]>([]);
  const [categoryInfo, setCategoryInfo] = useState<any>(null);
  
  // Filtering & Sorting State
  const [selectedBrand, setSelectedBrand] = useState<string>("All");
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("recommended");
  const [priceRange, setPriceRange] = useState<number>(200000);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);

  // Fetch category metadata and category products dynamically from MongoDB
  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      setLoading(true);
      try {
        // Fetch categories to find matching metadata slug
        const catRes = await fetch(`${API_BASE_URL}/categories`);
        let activeCategories: any[] = [];
        if (catRes.ok) {
          activeCategories = await catRes.json();
        }
        
        const cat = activeCategories.find((c: any) => c.slug === categoryId || c._id === categoryId);
        if (cat) {
          setCategoryInfo({
            id: cat.slug || cat._id,
            name: cat.name,
            description: cat.description || `Explore our complete range of ${cat.name} products.`,
            image: cat.image || "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=600&q=80",
            bannerImage: cat.bannerImage || cat.image || "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=1200&q=80",
          });
        } else {
          // Fallback to local categories
          const localCat = mockCategories.find((c) => c.id === categoryId);
          if (localCat) {
            setCategoryInfo(localCat);
          } else {
            setCategoryInfo(null);
          }
        }

        // Fetch products matching categoryId
        const prodRes = await fetch("http://localhost:8090/api/content/products");
        if (prodRes.ok) {
          const allProds = await prodRes.json();
          const filtered = allProds.filter((p: any) => 
            p.category === categoryId || 
            (cat && (p.category === cat.name || p.category === cat.slug))
          );
          setProducts(filtered);
        } else {
          // Fallback to mock products matching categoryId
          const filteredMock = mockProducts.filter((p) => p.category === categoryId);
          setProducts(filteredMock);
        }
      } catch (err) {
        console.error("Failed to load category products dynamically", err);
        // Fallback
        const localCat = mockCategories.find((c) => c.id === categoryId);
        setCategoryInfo(localCat || null);
        const filteredMock = mockProducts.filter((p) => p.category === categoryId);
        setProducts(filteredMock);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndProducts();
  }, [categoryId]);

  // Unique brands inside this category for the filter
  const brands = ["All", ...Array.from(new Set(products.map((p) => p.brand || "Generic")))];

  // Apply filters and sorting
  const filteredProducts = products
    .filter((p) => {
      const matchBrand = selectedBrand === "All" || (p.brand || "Generic") === selectedBrand;
      const matchStock = !inStockOnly || p.stock > 0 || p.inStock;
      const matchPrice = p.price <= priceRange;
      return matchBrand && matchStock && matchPrice;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return (b.rating || 5) - (a.rating || 5);
      return 0; // recommended / default
    });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800 p-6">
        <h2 className="text-xl font-bold text-[#201064] animate-pulse">Loading Category Catalog...</h2>
      </div>
    );
  }

  if (!categoryInfo) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800 p-6">
        <h2 className="text-2xl font-black text-[#201064]">Category Not Found</h2>
        <p className="text-slate-500 mt-2">The product category you are looking for does not exist.</p>
        <Link
          to="/categories"
          className="mt-6 bg-[#201064] hover:bg-[#0A7FE6] text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow"
        >
          View All Categories
        </Link>
      </div>
    );
  }

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
          <Link to="/categories" className="hover:text-[#0A7FE6]">
            Categories
          </Link>
          <FaChevronRight size={8} />
          <span className="text-[#201064]">{categoryInfo.name}</span>
        </div>

        {/* Category Header */}
        <div 
          className="bg-[#201064] rounded-3xl p-8 md:p-12 text-white relative overflow-hidden mb-10 shadow-lg"
          style={{
            backgroundImage: categoryInfo.bannerImage ? `linear-gradient(to right, rgba(32, 16, 100, 0.95), rgba(32, 16, 100, 0.55)), url(${categoryInfo.bannerImage})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Subtle grid accent overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.03]" />
          
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-extrabold uppercase tracking-[4px] text-cyan-400">
              SAKROBOTIX STORE
            </span>
            <h1 className="text-3xl md:text-5xl font-black mt-3">{categoryInfo.name}</h1>
            <p className="text-slate-200 mt-4 text-sm sm:text-base leading-relaxed font-semibold">
              {categoryInfo.description}
            </p>
          </div>
        </div>

        {/* Main Content Area: Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-150">
                <h3 className="font-black text-sm text-[#201064] flex items-center gap-2 uppercase tracking-wider">
                  <FaSlidersH />
                  <span>Filters</span>
                </h3>
                <button
                  onClick={() => {
                    setSelectedBrand("All");
                    setInStockOnly(false);
                    setSortBy("recommended");
                    setPriceRange(200000);
                  }}
                  className="text-xs font-bold text-rose-500 hover:underline cursor-pointer"
                >
                  Clear All
                </button>
              </div>

              {/* Brand Filter */}
              <div>
                <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-2.5">
                  Brand
                </label>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <label key={brand} className="flex items-center gap-2.5 text-sm font-semibold text-slate-600 cursor-pointer">
                      <input
                        type="radio"
                        name="brandFilter"
                        checked={selectedBrand === brand}
                        onChange={() => setSelectedBrand(brand)}
                        className="rounded border-slate-300 text-[#0A7FE6] focus:ring-[#0A7FE6] h-4 w-4"
                      />
                      <span>{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-2.5">
                  Max Price: <span className="text-[#0A7FE6]">₹{priceRange.toLocaleString("en-IN")}</span>
                </label>
                <input
                  type="range"
                  min={100}
                  max={200000}
                  step={500}
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-[#0A7FE6]"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1.5">
                  <span>₹100</span>
                  <span>₹2,00,000</span>
                </div>
              </div>

              {/* Availability Filter */}
              <div>
                <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-2.5">
                  Availability
                </label>
                <label className="flex items-center gap-2.5 text-sm font-semibold text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded border-slate-300 text-[#0A7FE6] focus:ring-[#0A7FE6] h-4 w-4"
                  />
                  <span>Exclude Out of Stock</span>
                </label>
              </div>
            </div>
          </div>

          {/* Mobile Filter Drawer Modal */}
          {isFilterDrawerOpen && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[999] flex justify-end p-4 overflow-y-auto lg:hidden">
              <div className="bg-white w-full max-w-sm rounded-3xl p-6 relative flex flex-col justify-between shadow-2xl h-fit border border-slate-100 max-h-[90vh]">
                <button
                  type="button"
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition cursor-pointer"
                >
                  <span className="font-extrabold text-sm">✕</span>
                </button>

                <div className="space-y-6 overflow-y-auto no-scrollbar pr-1 flex-grow">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-150">
                    <h3 className="font-black text-sm text-[#201064] flex items-center gap-2 uppercase tracking-wider">
                      <FaSlidersH />
                      <span>Filters</span>
                    </h3>
                    <button
                      onClick={() => {
                        setSelectedBrand("All");
                        setInStockOnly(false);
                        setSortBy("recommended");
                        setPriceRange(200000);
                      }}
                      className="text-xs font-bold text-rose-500 hover:underline cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>

                  {/* Brand Filter */}
                  <div>
                    <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-2.5">
                      Brand
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
                      {brands.map((brand) => (
                        <label key={brand} className="flex items-center gap-2.5 text-sm font-semibold text-slate-600 cursor-pointer">
                          <input
                            type="radio"
                            name="brandFilterMobile"
                            checked={selectedBrand === brand}
                            onChange={() => setSelectedBrand(brand)}
                            className="rounded border-slate-300 text-[#0A7FE6] focus:ring-[#0A7FE6] h-4 w-4"
                          />
                          <span>{brand}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Filter */}
                  <div>
                    <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-2.5">
                      Max Price: <span className="text-[#0A7FE6]">₹{priceRange.toLocaleString("en-IN")}</span>
                    </label>
                    <input
                      type="range"
                      min={100}
                      max={200000}
                      step={500}
                      value={priceRange}
                      onChange={(e) => setPriceRange(Number(e.target.value))}
                      className="w-full accent-[#0A7FE6]"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1.5">
                      <span>₹100</span>
                      <span>₹2,00,000</span>
                    </div>
                  </div>

                  {/* Availability Filter */}
                  <div>
                    <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-2.5">
                      Availability
                    </label>
                    <label className="flex items-center gap-2.5 text-sm font-semibold text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={inStockOnly}
                        onChange={(e) => setInStockOnly(e.target.checked)}
                        className="rounded border-slate-300 text-[#0A7FE6] focus:ring-[#0A7FE6] h-4 w-4"
                      />
                      <span>Exclude Out of Stock</span>
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

          {/* Product Grid Area */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Sort & Stats Bar */}
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Showing {filteredProducts.length} of {products.length} Products
                </span>

                <button
                  type="button"
                  onClick={() => setIsFilterDrawerOpen(true)}
                  className="lg:hidden flex items-center gap-1.5 px-3.5 py-2 bg-[#201064] text-white rounded-xl text-xs font-bold shadow hover:bg-[#0A7FE6] transition cursor-pointer"
                >
                  <FaSlidersH size={10} />
                  <span>Filters</span>
                </button>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-start">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <FaSortAmountDown />
                  <span>Sort:</span>
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 px-3 py-2 rounded-xl outline-none focus:border-[#0A7FE6] cursor-pointer"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <ProductGrid products={filteredProducts} isLoading={loading} />
          </div>

        </div>

      </div>
    </div>
  );
};

export default CategoryProducts;
