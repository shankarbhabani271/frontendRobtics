import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useApp } from "../../context/AppContext";
import { type Product, type Review, mockProducts } from "../../data/mockProducts";
import { ProductDetailsSkeleton } from "../../components/ui/Skeleton";
import ImageGallery from "./components/ImageGallery";
import ProductInfo from "./components/ProductInfo";
import ProductSpecs from "./components/ProductSpecs";
import ReviewsSection from "./components/ReviewsSection";
import RelatedProducts from "./components/RelatedProducts";
import { FaChevronRight, FaHistory, FaStar, FaHeart } from "react-icons/fa";

// Import assets for API mapping
import board1_real from "../../assets/wilyfox126.avif";
import board2_real from "../../assets/wilyfox-127.avif";
import board3_real from "../../assets/wilyfox-124.avif";
import board4_real from "../../assets/wilyfox-125.webp";
import board1 from "../../assets/imageforproject-1.webp";
import board2 from "../../assets/wilyfoxbhabani1.avif";
import board3 from "../../assets/wilyfoxbhabani2.avif";
import board4 from "../../assets/wilyfoxbhabani3.avif";
import extra1 from "../../assets/wilyfox-123.png";
import extra2 from "../../assets/wilyfoximage1.png";
import extra3 from "../../assets/wilyfoximage2.png";
import extra4 from "../../assets/wilfox-image3.png";
import extra5 from "../../assets/wilfoximage45.png";

const assetLookup: Record<string, string> = {
  board1_real,
  board2_real,
  board3_real,
  board4_real,
  board1,
  board2,
  board3,
  board4,
  extra1,
  extra2,
  extra3,
  extra4,
  extra5,
};

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addRecentlyViewed, getRecentlyViewedProducts, toggleWishlist, isInWishlist } = useApp();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewsList, setReviewsList] = useState<Review[]>([]);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch from Express API (backend may be in-memory mock or real MongoDB)
        const response = await axios.get<any>(`http://localhost:8090/api/products/${id}`);
        const apiData = response.data;

        // Derive the client-facing id
        const resolvedId = apiData.id || apiData._id || "";

        // Try to find a matching local mock to enrich missing content fields
        // Match by numeric id, backend-stored id, or name
        const localMatch = mockProducts.find(
          (p) =>
            p.id === resolvedId ||
            p.id === apiData.id ||
            p.name === apiData.name
        );

        // Resolve any asset-key images to imported assets (or keep URL strings as-is)
        const resolvedImages =
          apiData.images && apiData.images.length > 0
            ? apiData.images.map((img: string) => assetLookup[img] || img)
            : localMatch?.images || ["https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=600&q=80"];

        // Merge: API dynamic fields take priority; local mock fills rich content gaps
        const mergedProduct: Product = {
          id: resolvedId,
          name: apiData.name || localMatch?.name || "Product",
          brand: apiData.brand || localMatch?.brand || "SAKROBOTIX",
          category: apiData.category || localMatch?.category || "general",
          rating: apiData.rating ?? localMatch?.rating ?? 5,
          reviewCount: apiData.reviewCount ?? localMatch?.reviewCount ?? 0,
          price: apiData.price ?? localMatch?.price ?? 0,
          originalPrice: apiData.originalPrice ?? localMatch?.originalPrice ?? apiData.price ?? 0,
          discount: apiData.discount ?? localMatch?.discount ?? 0,
          inStock: apiData.stock !== undefined ? apiData.stock > 0 : (localMatch?.inStock ?? true),
          deliveryInfo: apiData.deliveryInfo || localMatch?.deliveryInfo || "FREE Delivery: Estimated within 3-5 business days.",
          highlights: (apiData.highlights && apiData.highlights.length > 0)
            ? apiData.highlights
            : (localMatch?.highlights && localMatch.highlights.length > 0)
              ? localMatch.highlights
              : [apiData.description || "Premium quality product"],
          description: apiData.description || localMatch?.description || "",
          keyFeatures: (apiData.keyFeatures && apiData.keyFeatures.length > 0)
            ? apiData.keyFeatures
            : (localMatch?.keyFeatures || []),
          specifications: (apiData.specifications && Object.keys(apiData.specifications).length > 0)
            ? apiData.specifications
            : (localMatch?.specifications || {}),
          dimensions: apiData.dimensions || localMatch?.dimensions || "N/A",
          material: apiData.material || localMatch?.material || "N/A",
          warranty: apiData.warranty || localMatch?.warranty || "1 Year Warranty",
          images: resolvedImages,
          reviews: (apiData.reviews && apiData.reviews.length > 0)
            ? apiData.reviews
            : (localMatch?.reviews || []),
          sku: apiData.sku || localMatch?.sku || "",
          availability: apiData.stock > 0 ? "In Stock" : "Out of Stock",
        };

        setTimeout(() => {
          setProduct(mergedProduct);
          setReviewsList(mergedProduct.reviews || []);
          addRecentlyViewed(resolvedId || id);
          setLoading(false);
        }, 800);

      } catch (err) {
        console.warn("Backend API not reachable. Falling back to local data source.", err);

        // Full fallback to local mock data
        const localProduct = mockProducts.find((p) => p.id === id);

        setTimeout(() => {
          if (localProduct) {
            setProduct(localProduct);
            setReviewsList(localProduct.reviews || []);
            addRecentlyViewed(id);
          } else {
            setError("Product not found");
          }
          setLoading(false);
        }, 800);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddReview = (newReview: Review) => {
    setReviewsList((prev) => [newReview, ...prev]);
    
    // Update local product reviews count in state
    if (product) {
      setProduct({
        ...product,
        reviewCount: product.reviewCount + 1,
        rating: Number(((product.rating * product.reviewCount + newReview.rating) / (product.reviewCount + 1)).toFixed(1)),
      });
    }
  };

  if (loading) {
    return <ProductDetailsSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-3xl font-bold text-[#201064]">Product Not Found</h2>
        <p className="text-slate-500 max-w-md mx-auto">
          We couldn't find the product you are looking for. It may have been discontinued or the link is incorrect.
        </p>
        <Link
          to="/"
          className="inline-block bg-[#201064] text-white hover:bg-[#321d96] font-bold px-6 py-3 rounded-lg text-sm transition"
        >
          Return to Storefront
        </Link>
      </div>
    );
  }

  const recentlyViewedProducts = getRecentlyViewedProducts().filter((p) => p.id !== product.id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 space-y-8">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500">
        <Link to="/" className="hover:text-indigo-600 transition">
          Home
        </Link>
        <FaChevronRight size={10} className="text-slate-300" />
        <span className="hover:text-indigo-600 transition cursor-pointer">
          {product.brand}
        </span>
        <FaChevronRight size={10} className="text-slate-300" />
        <span className="text-slate-700 truncate max-w-[200px] sm:max-w-xs">
          {product.name}
        </span>
      </nav>

      {/* Main Grid: Left Gallery, Right Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Gallery column: sticky on scroll */}
        <div className="lg:col-span-5 lg:sticky lg:top-6">
          <ImageGallery images={product.images} />
        </div>

        {/* Right Product details scrollable column */}
        <div className="lg:col-span-7 space-y-8">
          <ProductInfo product={product} />
          
          <ProductSpecs product={product} />

          <ReviewsSection
            reviews={reviewsList}
            rating={product.rating}
            reviewCount={product.reviewCount}
            onAddReview={handleAddReview}
          />

          <RelatedProducts currentProductId={product.id} />
        </div>

      </div>

      {/* Recently Viewed Products Section */}
      {recentlyViewedProducts.length > 0 && (
        <div className="border-t border-slate-200 pt-8 space-y-5">
          <h2 className="text-xl sm:text-2xl font-bold text-[#201064] flex items-center gap-2">
            <FaHistory className="text-slate-400" size={18} /> Recently Viewed Products
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {recentlyViewedProducts.map((p) => {
              const wishlisted = isInWishlist(p.id);
              return (
                <div
                  key={p.id}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition duration-300 p-4 relative flex flex-col justify-between group"
                >
                  <Link to={`/product/${p.id}`} className="space-y-3 block">
                    <div className="h-32 bg-white flex items-center justify-center p-2 overflow-hidden">
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="max-h-full object-contain group-hover:scale-105 transition duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {p.brand}
                      </span>
                      <h4 className="text-slate-800 text-xs sm:text-sm font-semibold line-clamp-2 min-h-[36px] mt-0.5 group-hover:text-[#201064] transition">
                        {p.name}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <div className="flex text-yellow-400 text-[10px]">
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaStar className={p.rating >= 3.5 ? "text-yellow-400" : "text-gray-200"} />
                          <FaStar className={p.rating >= 4.5 ? "text-yellow-400" : "text-gray-200"} />
                        </div>
                      </div>
                    </div>
                  </Link>

                  <div className="flex items-baseline justify-between border-t border-slate-50 pt-2.5 mt-3">
                    <span className="text-sm sm:text-base font-extrabold text-[#201064]">
                      ₹{p.price.toLocaleString()}
                    </span>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(p.id);
                      }}
                      className={`p-1.5 rounded-full border shadow-sm transition ${
                        wishlisted
                          ? "bg-rose-50 border-rose-100 text-rose-500 hover:bg-rose-100"
                          : "bg-white border-slate-200 text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      <FaHeart size={10} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductDetailsPage;
