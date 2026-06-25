import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useApp } from "../context/AppContext";
import { type Product, mockProducts } from "../data/mockProducts";
import ProductGallery from "../components/ProductGallery";
import ProductSpecifications from "../components/ProductSpecifications";
import ProductReview from "../components/ProductReview";
import ProductCarousel from "../components/ProductCarousel";
import { 
  FaHome, FaChevronRight, FaHeart, FaShoppingCart, FaHistory, 
  FaCheckCircle, FaExclamationCircle, FaTruck, FaShieldAlt, 
  FaHeadphones, FaEnvelope, FaBuilding, FaPhone, FaTimes, 
  FaBoxOpen
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

// Import assets for API mapping
import board1_real from "../assets/wilyfox126.avif";
import board2_real from "../assets/wilyfox-127.avif";
import board3_real from "../assets/wilyfox-124.avif";
import board4_real from "../assets/wilyfox-125.webp";
import board1 from "../assets/imageforproject-1.webp";
import board2 from "../assets/wilyfoxbhabani1.avif";
import board3 from "../assets/wilyfoxbhabani2.avif";
import board4 from "../assets/wilyfoxbhabani3.avif";
import extra1 from "../assets/wilyfox-123.png";
import extra2 from "../assets/wilyfoximage1.png";
import extra3 from "../assets/wilyfoximage2.png";
import extra4 from "../assets/wilfox-image3.png";
import extra5 from "../assets/wilfoximage45.png";

// Drones
import drone1 from "../assets/drones image.webp";
import drone2 from "../assets/drones iamge-2.webp";
import drone3 from "../assets/drones image 3.webp";
import drone4 from "../assets/drones image 4.webp";

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
  drone1,
  drone2,
  drone3,
  drone4,
};

// Dynamic specifications and features fallbacks for DB-created products
const getCategoryFallbackData = (categoryStr: string, name: string) => {
  const cat = categoryStr.toLowerCase();
  
  if (cat.includes("drone")) {
    return {
      specifications: {
        "General": {
          "Model": name,
          "Type": "Unmanned Aerial Vehicle (UAV)",
          "Weight": "450g",
          "Color": "Slate Grey",
          "Material": "Carbon-Fiber Polymer"
        },
        "Power & Connectivity": {
          "Power Requirement": "11.1V - 14.8V LiPo Battery",
          "Connectivity": "2.4GHz / 5.8GHz Remote Control",
          "Telemetry Range": "Up to 5 km"
        }
      },
      highlights: [
        "High-performance flight dynamics with auto-stabilization",
        "Aviation-grade lightweight structural components",
        "Designed for education, research, and aerial monitoring",
        "Compatible with standard FPV goggles and transmitters"
      ],
      keyFeatures: [
        "Acro and Angle stabilization flight modes",
        "High-density brushless motors for maximum thrust",
        "Low-latency real-time video telemetry stream support"
      ],
      packageContents: [
        "1 x Drone Frame Assembly",
        "4 x High-Efficiency Propellers",
        "1 x LiPo Balance Charger",
        "1 x Quickstart User Manual"
      ],
      warranty: "1 Year SAKROBOTIX Store Warranty",
      weight: "450g",
      dimensions: "220 x 220 x 85 mm",
      powerRequirement: "11.1V - 14.8V LiPo Battery",
      connectivity: "2.4GHz/5.8GHz RF",
      material: "Carbon-Fiber Polymer"
    };
  } else if (cat.includes("3d") || cat.includes("print")) {
    return {
      specifications: {
        "General": {
          "Model": name,
          "Type": "3D Printer Component",
          "Weight": "120g",
          "Material": "Brass, Aluminum & PTFE"
        },
        "Power & Operation": {
          "Power Requirement": "12V / 24V DC",
          "Connectivity": "Wired Pin Connections",
          "Operating Temperature": "Up to 280°C"
        }
      },
      highlights: [
        "Premium quality CNC machined layout",
        "Uniform heat distribution with minimal clogs",
        "Compatible with standard Ender, Prusa and CR series printers",
        "Supports PLA, ABS, PETG, and flexible TPU materials"
      ],
      keyFeatures: [
        "Highly durable wear-resistant composition",
        "Consistent dimensional tolerance for precise prints",
        "Simple drop-in installation and wiring setup"
      ],
      packageContents: [
        "1 x Printer Component / Nozzle Kit",
        "2 x Replacement Connector Plugs",
        "1 x Installation Guide Sheet"
      ],
      warranty: "6 Months Technical Warranty",
      weight: "120g",
      dimensions: "45 x 45 x 30 mm",
      powerRequirement: "12V / 24V DC",
      connectivity: "Wired Connector Pins",
      material: "Brass / Aluminum"
    };
  } else if (cat.includes("wireless") || cat.includes("module") || cat.includes("bluetooth") || cat.includes("wifi") || cat.includes("lora")) {
    return {
      specifications: {
        "General": {
          "Model": name,
          "Type": "Wireless RF Transceiver Module",
          "Weight": "12g",
          "Material": "FR4 Glass Epoxy PCB"
        },
        "Technical Specifications": {
          "Power Requirement": "3.3V - 5V DC",
          "Connectivity": "Wi-Fi, Bluetooth BLE, or LoRa RF",
          "Data Rate": "Up to 2 Mbps"
        }
      },
      highlights: [
        "Integrated PCB antenna for maximum range efficiency",
        "Low power sleep profiles for battery operation",
        "Breadboard-friendly header pin configuration",
        "Supported by Arduino, ESP-IDF and MicroPython"
      ],
      keyFeatures: [
        "Advanced wireless transceiver protocol stack",
        "Highly sensitive RF receiver capabilities",
        "Robust anti-interference spread spectrum design"
      ],
      packageContents: [
        "1 x Wireless Transceiver Module",
        "1 x External Spring Antenna (where applicable)",
        "1 x Pin Header Strip (soldered or unsoldered)"
      ],
      warranty: "3 Months Quality Warranty",
      weight: "12g",
      dimensions: "48 x 28 x 12 mm",
      powerRequirement: "3.3V - 5V DC",
      connectivity: "Wi-Fi / Bluetooth BLE / RF",
      material: "FR4 Glass Epoxy PCB"
    };
  } else if (cat.includes("sensor")) {
    return {
      specifications: {
        "General": {
          "Model": name,
          "Type": "Robotics Sensor Module",
          "Weight": "15g",
          "Material": "FR4 PCB & Electronic components"
        },
        "Operational Parameters": {
          "Power Requirement": "5V DC",
          "Connectivity": "GPIO, Analog, I2C, or SPI Pins",
          "Sensing Distance": "2 cm to 400 cm"
        }
      },
      highlights: [
        "High sensitivity with fast response times",
        "Accurate measurement with minimal environmental interference",
        "Standard 3-pin / 4-pin electronic block configuration",
        "Fully compatible with Arduino, Raspberry Pi and micro:bit"
      ],
      keyFeatures: [
        "Real-time sensor value telemetry reading",
        "Pre-calibrated analog or digital output signal",
        "Compact form factor for easy physical mount"
      ],
      packageContents: [
        "1 x Sensor Module Board",
        "1 x Technical Data Reference Sheet"
      ],
      warranty: "3 Months Technical Warranty",
      weight: "15g",
      dimensions: "45 x 20 x 15 mm",
      powerRequirement: "5V DC",
      connectivity: "GPIO / Analog / I2C Pins",
      material: "FR4 PCB & Electronics"
    };
  } else if (cat.includes("kit") || cat.includes("robot")) {
    return {
      specifications: {
        "General": {
          "Model": name,
          "Type": "STEM Robotics Learning Kit",
          "Weight": "750g",
          "Material": "Acrylic, Polycarbonate & Metal Alloys"
        },
        "System Requirements": {
          "Power Requirement": "7.4V - 12V Battery Pack",
          "Connectivity": "Bluetooth, RF, or Wired USB Control",
          "Controller MCU": "Arduino Compatible Board"
        }
      },
      highlights: [
        "Step-by-step assembly guides with video tutorials",
        "Hands-on learning for coding, logic, and physical computing",
        "Complete structural parts, motors, and cables included",
        "Programmable via graphical block coding or C++"
      ],
      keyFeatures: [
        "Multi-functional robot configuration setups",
        "Modular expansion ports to plug in custom sensors",
        "High-grip rubber wheels and durable chassis panels"
      ],
      packageContents: [
        "1 x Acrylic Robot Chassis Set",
        "1 x Arduino Compatible Microcontroller",
        "1 x Set of Gear Motors & Wheels",
        "1 x Detailed Assembly Instruction Manual",
        "1 x Jumper Wire Cable Set"
      ],
      warranty: "6 Months SAKROBOTIX System Warranty",
      weight: "750g",
      dimensions: "220 x 160 x 85 mm",
      powerRequirement: "7.4V - 12V Battery Pack",
      connectivity: "Bluetooth / USB Interface",
      material: "Acrylic / Metal"
    };
  } else {
    // Development boards or general fallback
    return {
      specifications: {
        "General": {
          "Model": name,
          "Type": "Microcontroller Development Board",
          "Weight": "35g",
          "Material": "FR4 Glass Epoxy PCB"
        },
        "Operational Parameters": {
          "Power Requirement": "5V DC via Micro-USB / USB-C",
          "Connectivity": "UART Serial, SPI, I2C, USB Interface",
          "Clock Speed": "16 MHz - 240 MHz"
        }
      },
      highlights: [
        "Ideal for hardware prototyping, school and college labs",
        "Standard pin layout fits standard prototype breadboards",
        "Rich ecosystem of open-source library codes",
        "Features onboard voltage regulators and reset button"
      ],
      keyFeatures: [
        "Durable lead-free component solder joint finish",
        "Flexible power input options (USB or external VCC)",
        "Onboard debugging/telemetry status LEDs"
      ],
      packageContents: [
        "1 x Development Board Module",
        "1 x High-Quality USB Interface Cable"
      ],
      warranty: "1 Year Store Warranty",
      weight: "35g",
      dimensions: "85 x 54 x 15 mm",
      powerRequirement: "5V DC via USB / Pins",
      connectivity: "UART / SPI / I2C / USB",
      material: "FR4 Epoxy Board"
    };
  }
};

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist, addRecentlyViewed, getRecentlyViewedProducts } = useApp();

  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Custom states for interactive features
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState<"idle" | "checking" | "available" | "unavailable">("idle");
  const [pincodeMsg, setPincodeMsg] = useState("");
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [enquiryForm, setEnquiryForm] = useState({
    name: "",
    email: "",
    institution: "",
    phone: "",
    notes: "",
    qty: 10
  });

  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "specs", label: "Specifications" },
    { id: "features", label: "Features" },
    { id: "package", label: "Package Contents" },
    { id: "warranty", label: "Warranty" }
  ];

  const isWishlisted = product ? isInWishlist(product.id) : false;

  useEffect(() => {
    if (!id) return;
    
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      setQuantity(1); // Reset qty on product change
      setPincode("");
      setPincodeStatus("idle");
      setPincodeMsg("");
      
      try {
        // Fetch from Express API
        const response = await axios.get<Product>(`http://localhost:8090/api/products/${id}`);
        
        // Resolve dynamic strings to imported assets
        const resolvedImages = response.data.images.map((img) => assetLookup[img] || img);
        const resolvedProduct = {
          ...response.data,
          images: resolvedImages,
        };

        // Fetch all active products dynamically for carousels
        try {
          const allRes = await axios.get<any[]>("http://localhost:8090/api/content/products");
          if (allRes.status === 200 && Array.isArray(allRes.data)) {
            setAllProducts(allRes.data);
          }
        } catch (err) {
          console.warn("Could not fetch database products for carousel, using fallback.", err);
        }

        setTimeout(() => {
          setProduct(resolvedProduct);
          addRecentlyViewed(id);
          setLoading(false);
        }, 500);
        
      } catch (err) {
        console.warn("Backend API not reachable. Falling back to local data source.", err);
        
        // Fallback to local mock data
        const localProduct = mockProducts.find((p) => p.id === id);
        
        setTimeout(() => {
          if (localProduct) {
            setProduct(localProduct);
            addRecentlyViewed(id);
          } else {
            setError("Product not found");
          }
          setLoading(false);
        }, 500);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      Swal.fire({
        title: "Added to Cart!",
        text: `${quantity} x ${product.name} successfully added to your cart.`,
        icon: "success",
        toast: true,
        position: "top-end",
        timer: 3000,
        showConfirmButton: false
      });
    }
  };

  const handleBuyNow = () => {
    if (product) {
      navigate("/checkout", {
        state: {
          product: {
            id: product.id || (product as any)._id,
            name: product.name,
            price: product.price,
            image: imagesList[0],
            category: productCategoryStr,
            brand: product.brand
          },
          quantity: quantity
        }
      });
    }
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || !/^\d{6}$/.test(pincode)) {
      setPincodeStatus("idle");
      Swal.fire({
        title: "Invalid Pincode",
        text: "Please enter a valid 6-digit pin code (e.g. 751024).",
        icon: "warning",
        confirmButtonColor: "#201064"
      });
      return;
    }

    setPincodeStatus("checking");
    setTimeout(() => {
      // Mock logic: pincodes ending in '00' or starting with '99' are not deliverable
      if (pincode.endsWith("00") || pincode.startsWith("99")) {
        setPincodeStatus("unavailable");
        setPincodeMsg("We currently do not offer delivery to this location.");
      } else {
        setPincodeStatus("available");
        
        // Dynamic dates
        const days = pincode.startsWith("1") || pincode.startsWith("7") ? 2 : 4;
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + days);
        const dateStr = deliveryDate.toLocaleDateString("en-IN", {
          weekday: "long",
          day: "numeric",
          month: "short"
        });

        const totalPrice = (product?.price || 0) * quantity;
        const isFree = totalPrice >= 500;
        const shipCost = isFree ? "FREE Delivery" : "₹40 Shipping Charge";

        setPincodeMsg(`Delivery Available by ${dateStr}. (${shipCost})`);
      }
    }, 800);
  };

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryForm.name || !enquiryForm.email || !enquiryForm.phone || !enquiryForm.institution) {
      Swal.fire({
        title: "Validation Error",
        text: "Please fill in all the required fields (*).",
        icon: "error",
        confirmButtonColor: "#201064"
      });
      return;
    }

    setIsEnquiryModalOpen(false);
    Swal.fire({
      title: "Enquiry Registered!",
      text: `Thank you, ${enquiryForm.name}. Our Institutional Sales Team has received your request and will follow up with wholesale quotes within 24 hours.`,
      icon: "success",
      confirmButtonColor: "#201064"
    });

    // Reset
    setEnquiryForm({
      name: "",
      email: "",
      institution: "",
      phone: "",
      notes: "",
      qty: 10
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse">
        <div className="lg:col-span-5 aspect-square bg-slate-100 rounded-3xl" />
        <div className="lg:col-span-7 space-y-6">
          <div className="h-4 bg-slate-200 rounded w-1/4" />
          <div className="h-8 bg-slate-200 rounded w-3/4" />
          <div className="h-6 bg-slate-200 rounded w-1/3" />
          <div className="h-20 bg-slate-200 rounded w-full" />
          <div className="h-12 bg-slate-200 rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-6">
        <h2 className="text-3xl font-black text-[#201064]">Product Not Found</h2>
        <p className="text-slate-500 max-w-md mx-auto">
          We couldn't find the product you are looking for. It may have been discontinued or the link is incorrect.
        </p>
        <Link
          to="/products"
          className="inline-block bg-[#201064] text-white hover:bg-[#0A7FE6] font-bold px-8 py-3.5 rounded-xl text-sm transition-all shadow"
        >
          Return to Storefront
        </Link>
      </div>
    );
  }

  // Dynamic products list for carousels
  const activeProductList = allProducts.length > 0 
    ? allProducts.map(p => ({ ...p, id: p._id })) 
    : mockProducts;

  const currentProductId = product.id || (product as any)._id;
  const productCategoryStr = typeof product.category === "string" ? product.category : (product.category as any)?.slug || (product.category as any)?.name || "";

  // Dynamic mapping fallback resolver
  const fallbackData = getCategoryFallbackData(productCategoryStr, product.name);

  // Merge fallbacks for DB elements
  const finalHighlights = product.highlights && product.highlights.length > 0 ? product.highlights : fallbackData.highlights;
  const finalKeyFeatures = product.keyFeatures && product.keyFeatures.length > 0 ? product.keyFeatures : fallbackData.keyFeatures;
  const finalPackageContents = (product as any).packageContents && (product as any).packageContents.length > 0
    ? (product as any).packageContents
    : fallbackData.packageContents;
  const finalWarranty = product.warranty || fallbackData.warranty;
  const finalSpecifications: any = product.specifications && Object.keys(product.specifications).length > 0 
    ? product.specifications 
    : fallbackData.specifications;



  // Carousels configuration
  const relatedProducts = activeProductList.filter(
    (p) => {
      const pCat = typeof p.category === "string" ? p.category : (p.category as any)?.slug || (p.category as any)?.name || "";
      return pCat === productCategoryStr && p.id !== currentProductId;
    }
  );

  const similarProducts = relatedProducts.slice(0, 5);
  const featuredProductsFromCategory = relatedProducts.filter((p) => p.isFeatured).slice(0, 5);
  const recentlyViewedProducts = getRecentlyViewedProducts().filter((p) => p.id !== currentProductId);

  // Frequently Bought Together configuration
  const accessoryProduct = relatedProducts.length > 0 ? relatedProducts[0] : null;
  const bundleDiscountPercent = 5;
  const baseCombinedPrice = product.price + (accessoryProduct ? accessoryProduct.price : 0);
  const bundleCombinedPrice = Math.round(baseCombinedPrice * (1 - bundleDiscountPercent / 100));

  const handleAddBundleToCart = () => {
    if (product && accessoryProduct) {
      addToCart(product, 1);
      addToCart(accessoryProduct, 1);
      Swal.fire({
        title: "Bundle Added!",
        text: `Both ${product.name} and ${accessoryProduct.name} have been added to your cart with a special discount.`,
        icon: "success",
        confirmButtonColor: "#201064"
      });
    }
  };

  const imagesList = product.images && product.images.length > 0 ? product.images : [
    (product as any).image || "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=600&q=80"
  ];

  const accessoryImages = accessoryProduct && accessoryProduct.images && accessoryProduct.images.length > 0
    ? accessoryProduct.images
    : [(accessoryProduct as any)?.image || "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=600&q=80"];

  // Quantity Pricing math
  const priceUnit = product.price;
  const originalPriceUnit = product.originalPrice && product.originalPrice > priceUnit ? product.originalPrice : Math.round(priceUnit * 1.25);
  const discountRate = product.discount || Math.round(((originalPriceUnit - priceUnit) / originalPriceUnit) * 100);

  const finalPrice = priceUnit * quantity;
  const finalOriginalPrice = originalPriceUnit * quantity;
  const totalSavings = finalOriginalPrice - finalPrice;

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <Link to="/" className="hover:text-[#0A7FE6] flex items-center gap-1">
            <FaHome />
            <span>Home</span>
          </Link>
          <FaChevronRight size={8} />
          <Link to="/categories" className="hover:text-[#0A7FE6]">
            Categories
          </Link>
          <FaChevronRight size={8} />
          <Link to={`/category/${productCategoryStr}`} className="hover:text-[#0A7FE6]">
            {productCategoryStr.replace("-", " ")}
          </Link>
          <FaChevronRight size={8} />
          <span className="text-[#201064] truncate max-w-[200px]">{product.name}</span>
        </div>

        {/* Product Details Section (Flipkart style layout) */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
          
          {/* Left Column: Image Gallery & Checkout Buttons */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <ProductGallery images={imagesList} />

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-[#FF9F00] hover:bg-[#ff8c00] active:scale-95 text-white py-4 rounded-xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition cursor-pointer"
              >
                <FaShoppingCart size={15} />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 bg-[#FB641B] hover:bg-[#e65100] active:scale-95 text-white py-4 rounded-xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition cursor-pointer"
              >
                <span>Buy Now</span>
              </button>
            </div>
          </div>

          {/* Right Column: Info details */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-[#0A7FE6] uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
                  {product.brand}
                </span>

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product.id || (product as any)._id || "")}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-bold transition duration-300 cursor-pointer ${
                    isWishlisted
                      ? "bg-rose-50 border-rose-200 text-rose-500"
                      : "bg-white border-slate-200 text-slate-400 hover:text-rose-500 hover:bg-slate-50"
                  }`}
                >
                  <FaHeart className={isWishlisted ? "scale-110 fill-current" : "fill-current"} size={12} />
                  <span>{isWishlisted ? "Wishlisted" : "Add to Wishlist"}</span>
                </button>
              </div>

              <h1 className="text-2xl md:text-3xl font-black text-[#201064] mt-3 leading-tight">
                {product.name}
              </h1>

              {/* Rating block */}
              <div className="flex items-center gap-2 mt-3.5">
                <div className="bg-[#201064] text-white px-2 py-0.5 rounded-md text-xs font-extrabold flex items-center gap-1">
                  <span>{product.rating}</span>
                  <span className="text-[8px] text-yellow-400">★</span>
                </div>
                <span className="text-xs text-slate-400 font-bold">
                  {product.reviewCount} Ratings & Reviews
                </span>
              </div>
            </div>

            {/* Pricing Details Section */}
            <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-1">Pricing Summary</p>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-3xl font-black text-[#201064]">
                    ₹{finalPrice.toLocaleString("en-IN")}
                  </span>
                  <span className="text-sm line-through text-slate-400 font-semibold">
                    ₹{finalOriginalPrice.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 tracking-wide">
                    {discountRate}% OFF
                  </span>
                </div>
                <p className="text-xs font-extrabold text-[#E91E63] mt-1.5 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 bg-[#E91E63] rounded-full inline-block animate-ping"></span>
                  <span>You Save ₹{totalSavings.toLocaleString("en-IN")}</span>
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 w-fit">
                <span className="text-xs font-black text-slate-400 uppercase tracking-wide px-2">Qty</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 disabled:opacity-50 text-slate-700 flex items-center justify-center font-bold transition cursor-pointer"
                    aria-label="Decrease Quantity"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm font-black text-[#201064]">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center justify-center font-bold transition cursor-pointer"
                    aria-label="Increase Quantity"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* General Stock Status & SKU */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500">
              <div className="flex items-center gap-1.5">
                {product.inStock ? (
                  <span className="text-emerald-600 uppercase tracking-wider flex items-center gap-1">
                    <FaCheckCircle size={13} />
                    <span>{product.availability || "In Stock"}</span>
                  </span>
                ) : (
                  <span className="text-rose-600 uppercase tracking-wider flex items-center gap-1">
                    <FaExclamationCircle size={13} />
                    <span>Out of Stock</span>
                  </span>
                )}
              </div>
              <span className="text-slate-300">|</span>
              <span>SKU: {product.sku || `SAK-${productCategoryStr.toUpperCase()}-${currentProductId.substring(0, 5)}`}</span>
              <span className="text-slate-300">|</span>
              <span className="text-[#0A7FE6]">Category: {productCategoryStr.replace("-", " ")}</span>
            </div>

            {/* Delivery Pincode Checker */}
            <div className="bg-white p-5 rounded-2xl border border-slate-150 space-y-3.5">
              <h3 className="font-extrabold text-[#201064] text-sm uppercase tracking-wider flex items-center gap-2">
                <FaTruck className="text-[#0A7FE6]" />
                <span>Delivery & Shipping Estimator</span>
              </h3>
              
              <form onSubmit={handlePincodeCheck} className="flex gap-2 max-w-sm">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter Pincode"
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-[#201064] focus:outline-none focus:ring-2 focus:ring-[#0A7FE6] focus:bg-white transition"
                />
                <button
                  type="submit"
                  disabled={pincodeStatus === "checking"}
                  className="bg-[#201064] hover:bg-[#0A7FE6] text-white px-6 py-2.5 rounded-xl text-sm font-extrabold shadow transition cursor-pointer disabled:opacity-50"
                >
                  {pincodeStatus === "checking" ? "Checking..." : "Check"}
                </button>
              </form>

              {/* Pincode response state */}
              <AnimatePresence mode="wait">
                {pincodeStatus !== "idle" && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2.5 ${
                      pincodeStatus === "available"
                        ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                        : pincodeStatus === "unavailable"
                        ? "bg-rose-50 border-rose-100 text-rose-700"
                        : "bg-slate-50 border-slate-100 text-slate-600"
                    }`}
                  >
                    {pincodeStatus === "available" ? (
                      <FaCheckCircle className="text-emerald-500 flex-shrink-0" size={14} />
                    ) : (
                      <FaExclamationCircle className="text-rose-500 flex-shrink-0" size={14} />
                    )}
                    <div>
                      <p className="font-extrabold uppercase tracking-wide text-[10px]">
                        {pincodeStatus === "available" ? "Delivery Available" : "Delivery Not Available"}
                      </p>
                      <p className="mt-0.5 text-slate-500 font-semibold">{pincodeMsg}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Highlights */}
            {finalHighlights.length > 0 && (
              <div>
                <h3 className="font-extrabold text-[#201064] text-sm uppercase tracking-wider mb-2.5">Highlights</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-slate-500">
                  {finalHighlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-[#0A7FE6] text-sm leading-none">•</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Description Summary */}
            <div className="border-t border-slate-100 pt-5">
              <h3 className="font-extrabold text-[#201064] text-sm uppercase tracking-wider mb-2.5">Description</h3>
              <p className="text-slate-500 text-xs sm:text-sm font-semibold leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Key Features */}
            {finalKeyFeatures && finalKeyFeatures.length > 0 && (
              <div className="border-t border-slate-100 pt-5">
                <h3 className="font-extrabold text-[#201064] text-sm uppercase tracking-wider mb-2.5">Key Features</h3>
                <ul className="space-y-2 text-xs font-semibold text-slate-500">
                  {finalKeyFeatures.map((kf: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-[#E91E63] text-sm leading-none">✔</span>
                      <span>{kf}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Package Contents & Warranty Block (Cleaned up from right column) */}
          </div>
        </div>

        {/* Modern Compact Tabbed Product Details System */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-6">
          
          {/* Tab Headers selector bar */}
          <div className="flex border-b border-slate-200 overflow-x-auto no-scrollbar gap-2 sm:gap-6">
            {tabs.map((t) => {
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`pb-4 text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-all duration-300 relative border-b-2 cursor-pointer flex-shrink-0 px-1 ${
                    isActive
                      ? "border-[#0A7FE6] text-[#201064]"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Tab contents */}
          <div className="pt-2 min-h-[160px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-extrabold text-[#201064] text-sm uppercase tracking-wider mb-2.5">
                        Product Overview
                      </h3>
                      <p className="text-slate-500 text-xs sm:text-sm font-semibold leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    {/* Highlights */}
                    {finalHighlights.length > 0 && (
                      <div className="border-t border-slate-100 pt-5">
                        <h3 className="font-extrabold text-[#201064] text-sm uppercase tracking-wider mb-3">
                          Key Highlights & Advantages
                        </h3>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-slate-500">
                          {finalHighlights.map((h, i) => (
                            <li key={i} className="flex items-start gap-2.5 leading-relaxed">
                              <span className="text-[#0A7FE6] text-sm leading-none">•</span>
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "specs" && (
                  <div className="space-y-4">
                    <ProductSpecifications specifications={finalSpecifications as any} />
                  </div>
                )}

                {activeTab === "features" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-extrabold text-[#201064] text-sm uppercase tracking-wider mb-4">
                        Product Features & Value Benefits
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-3 hover:shadow-md transition">
                          <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0A7FE6] flex items-center justify-center">
                            <FaCheckCircle size={15} />
                          </div>
                          <h4 className="font-extrabold text-xs text-[#201064] uppercase tracking-wider">
                            100% Quality Assured
                          </h4>
                          <p className="text-slate-500 text-[11px] font-semibold leading-relaxed">
                            Tested & certified by SakRobotix lab experts for durability and high hardware stability in research.
                          </p>
                        </div>
                        <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-3 hover:shadow-md transition">
                          <div className="w-9 h-9 rounded-xl bg-violet-50 text-[#201064] flex items-center justify-center">
                            <FaShieldAlt size={15} />
                          </div>
                          <h4 className="font-extrabold text-xs text-[#201064] uppercase tracking-wider">
                            STEM Approved
                          </h4>
                          <p className="text-slate-500 text-[11px] font-semibold leading-relaxed">
                            Accredited design aligned with top school curricula, college engineering labs, and project standards.
                          </p>
                        </div>
                        <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-3 hover:shadow-md transition">
                          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <FaTruck size={15} />
                          </div>
                          <h4 className="font-extrabold text-xs text-[#201064] uppercase tracking-wider">
                            Secure Shipping
                          </h4>
                          <p className="text-slate-500 text-[11px] font-semibold leading-relaxed">
                            Dispatched inside shock-resistant bubble-wrap cases within 24 hours via reliable logistics.
                          </p>
                        </div>
                        <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-3 hover:shadow-md transition">
                          <div className="w-9 h-9 rounded-xl bg-rose-50 text-[#E91E63] flex items-center justify-center">
                            <FaHeadphones size={15} />
                          </div>
                          <h4 className="font-extrabold text-xs text-[#201064] uppercase tracking-wider">
                            Dedicated Support
                          </h4>
                          <p className="text-slate-500 text-[11px] font-semibold leading-relaxed">
                            Get lifetime access to our digital documentations, schematic libraries, and community forums.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Key Features bullet list */}
                    {finalKeyFeatures && finalKeyFeatures.length > 0 && (
                      <div className="border-t border-slate-100 pt-5">
                        <h3 className="font-extrabold text-[#201064] text-sm uppercase tracking-wider mb-3.5">
                          Core Technical Capacities
                        </h3>
                        <ul className="space-y-2 text-xs font-semibold text-slate-500">
                          {finalKeyFeatures.map((kf: string, i: number) => (
                            <li key={i} className="flex items-start gap-2.5 leading-relaxed">
                              <span className="text-[#E91E63] text-sm leading-none">✔</span>
                              <span>{kf}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "package" && (
                  <div className="space-y-4">
                    <h3 className="font-extrabold text-[#201064] text-sm uppercase tracking-wider mb-2">
                      What's Included in the Box
                    </h3>
                    <p className="text-xs text-slate-400 font-semibold mb-2">
                      Every shipment is professionally packaged to prevent damage during logistics.
                    </p>
                    <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 max-w-xl">
                      <ul className="text-xs font-bold text-slate-600 space-y-2.5">
                        {finalPackageContents.map((pc: string, i: number) => (
                          <li key={i} className="flex items-center gap-3">
                            <FaBoxOpen className="text-[#0A7FE6]" size={13} />
                            <span>{pc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === "warranty" && (
                  <div className="space-y-4">
                    <h3 className="font-extrabold text-[#201064] text-sm uppercase tracking-wider mb-2">
                      Warranty Coverage Details
                    </h3>
                    <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 max-w-xl space-y-3">
                      <div className="flex items-center gap-2.5 text-[#0A7FE6]">
                        <FaShieldAlt size={16} />
                        <span className="font-black text-xs uppercase tracking-wide">
                          {finalWarranty}
                        </span>
                      </div>
                      <p className="text-slate-500 text-xs font-semibold leading-relaxed">
                        The warranty covers all core technical defects and electronic malfunctions. Physical component damage, liquid spills, or post-delivery board burns are not eligible for replacement.
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold">
                        * Note: Please retain the packaging box and shipping invoice to claim technical support verification.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

        {/* Frequently Bought Together (FBT) Section */}
        {accessoryProduct && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-6">
            <h2 className="text-xl sm:text-2xl font-black text-[#201064] border-b border-slate-100 pb-4">
              Frequently Bought Together
            </h2>
            <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                
                {/* Current Product */}
                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 max-w-[280px]">
                  <div className="w-16 h-16 bg-white p-1 rounded-xl flex items-center justify-center flex-shrink-0">
                    <img src={imagesList[0]} alt={product.name} className="max-h-full object-contain" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#201064] line-clamp-2 leading-tight">{product.name}</h4>
                    <p className="text-xs font-extrabold text-slate-500 mt-1">₹{product.price.toLocaleString("en-IN")}</p>
                  </div>
                </div>

                {/* Plus sign */}
                <span className="text-2xl font-black text-slate-300 select-none">+</span>

                {/* Accessory Product */}
                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 max-w-[280px]">
                  <div className="w-16 h-16 bg-white p-1 rounded-xl flex items-center justify-center flex-shrink-0">
                    <img src={accessoryImages[0]} alt={accessoryProduct.name} className="max-h-full object-contain" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#201064] line-clamp-2 leading-tight">{accessoryProduct.name}</h4>
                    <p className="text-xs font-extrabold text-slate-500 mt-1">₹{accessoryProduct.price.toLocaleString("en-IN")}</p>
                  </div>
                </div>

              </div>

              {/* Price Bundle CTA */}
              <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 text-center md:text-right space-y-3.5 w-full md:w-auto">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Combined Price</p>
                  <div className="flex items-baseline justify-center md:justify-end gap-2.5 mt-1">
                    <span className="text-2xl font-black text-[#201064]">₹{bundleCombinedPrice.toLocaleString("en-IN")}</span>
                    <span className="text-xs line-through text-slate-400 font-bold">₹{baseCombinedPrice.toLocaleString("en-IN")}</span>
                  </div>
                  <p className="text-[10px] font-extrabold text-emerald-600 mt-0.5">Save ₹{(baseCombinedPrice - bundleCombinedPrice).toLocaleString("en-IN")} ({bundleDiscountPercent}% bundle savings)</p>
                </div>

                <button
                  onClick={handleAddBundleToCart}
                  className="w-full bg-[#FB641B] hover:bg-[#e65100] text-white font-extrabold text-xs uppercase tracking-wider px-6 py-3 rounded-xl shadow transition cursor-pointer"
                >
                  Add both to Cart
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Institutional / Bulk Enquiry Section */}
        <div className="bg-[#201064] text-white rounded-3xl p-6 md:p-10 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-blue-500/10 blur-[80px] pointer-events-none" />
          
          <div className="space-y-4 max-w-xl">
            <span className="text-[10px] bg-blue-500/30 border border-blue-400/30 text-blue-200 uppercase font-black tracking-widest px-3 py-1 rounded-full">
              B2B / Procurement
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              Bulk Orders & Institutional Purchases
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm font-semibold leading-relaxed">
              We specialize in custom assemblies for: School STEM Kits, College Research labs, Robotics Training centers, and turn-key Lab Setup. Contact us for bulk wholesale rates.
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs font-bold text-slate-200">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 bg-blue-400 rounded-full"></span>
                <span>School Orders</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 bg-blue-400 rounded-full"></span>
                <span>College Orders</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 bg-blue-400 rounded-full"></span>
                <span>Robotics Lab Setup</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 bg-blue-400 rounded-full"></span>
                <span>Training Center Supplies</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEnquiryModalOpen(true)}
            className="w-full md:w-auto px-8 py-4 bg-white text-[#201064] font-black text-sm uppercase tracking-wider rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.03] active:scale-95 transition cursor-pointer flex-shrink-0"
          >
            Submit Bulk Enquiry
          </button>
        </div>

        {/* Customer Reviews Section */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-6">
          <h2 className="text-xl sm:text-2xl font-black text-[#201064] border-b border-slate-100 pb-4">
            Customer Reviews
          </h2>
          <ProductReview initialReviews={product.reviews || []} productId={product.id || (product as any)._id || ""} />
        </div>

        {/* Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-[#201064] tracking-wide">
              Related Products
            </h2>
            <ProductCarousel products={relatedProducts} />
          </div>
        )}

        {/* Similar Products Carousel */}
        {similarProducts.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-[#201064] tracking-wide">
              Similar Products
            </h2>
            <ProductCarousel products={similarProducts} />
          </div>
        )}

        {/* Featured Products from Same Category Carousel */}
        {featuredProductsFromCategory.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-[#201064] tracking-wide">
              Featured Products in Category
            </h2>
            <ProductCarousel products={featuredProductsFromCategory} />
          </div>
        )}

        {/* Recently Viewed Products */}
        {recentlyViewedProducts.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-[#201064] flex items-center gap-2">
              <FaHistory className="text-slate-400" size={20} />
              <span>Recently Viewed Products</span>
            </h2>
            <ProductCarousel products={recentlyViewedProducts} />
          </div>
        )}

      </div>

      {/* BULK ENQUIRY FORM MODAL */}
      <AnimatePresence>
        {isEnquiryModalOpen && (
          <motion.div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white w-full max-w-lg rounded-3xl border border-slate-100 shadow-2xl p-6 relative overflow-hidden"
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
            >
              {/* Modal close */}
              <button
                onClick={() => setIsEnquiryModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition cursor-pointer"
              >
                <FaTimes size={14} />
              </button>

              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0A7FE6] flex items-center justify-center flex-shrink-0">
                    <FaBuilding size={16} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-[#201064] leading-tight">
                      Bulk Order Enquiry
                    </h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                      SAKROBOTIX Institutional Purchase
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-500 font-semibold leading-relaxed border-b border-slate-100 pb-3">
                  Please submit details regarding your organization requirements for <strong>{product.name}</strong>. Our team will prepare custom price schedules.
                </p>

                <form onSubmit={handleEnquirySubmit} className="space-y-4">
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wide">
                      Contact Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={enquiryForm.name}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                      placeholder="e.g. Dr. Ramesh Kumar"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-[#201064] focus:outline-none focus:ring-2 focus:ring-[#0A7FE6] focus:bg-white transition"
                    />
                  </div>

                  {/* Institution */}
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wide">
                      Institution / School / College <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={enquiryForm.institution}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, institution: e.target.value })}
                      placeholder="e.g. IIT Bhubaneswar, S Saketan School"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-[#201064] focus:outline-none focus:ring-2 focus:ring-[#0A7FE6] focus:bg-white transition"
                    />
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-wide">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
                        <input
                          type="email"
                          required
                          value={enquiryForm.email}
                          onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                          placeholder="name@institution.com"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold text-[#201064] focus:outline-none focus:ring-2 focus:ring-[#0A7FE6] focus:bg-white transition"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-wide">
                        Phone Number <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <FaPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 rotate-90" size={11} />
                        <input
                          type="tel"
                          required
                          value={enquiryForm.phone}
                          onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                          placeholder="+91 XXXXX XXXXX"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold text-[#201064] focus:outline-none focus:ring-2 focus:ring-[#0A7FE6] focus:bg-white transition"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wide">
                      Estimated Units Needed
                    </label>
                    <input
                      type="number"
                      min={5}
                      value={enquiryForm.qty}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, qty: parseInt(e.target.value) || 10 })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-[#201064] focus:outline-none focus:ring-2 focus:ring-[#0A7FE6] focus:bg-white transition"
                    />
                  </div>

                  {/* Special requirements */}
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wide">
                      Additional Requirements / Comments
                    </label>
                    <textarea
                      rows={3}
                      value={enquiryForm.notes}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, notes: e.target.value })}
                      placeholder="e.g. customized curriculum guides, accessories, delivery timelines..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-[#201064] focus:outline-none focus:ring-2 focus:ring-[#0A7FE6] focus:bg-white transition resize-none"
                    />
                  </div>

                  {/* Submit buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEnquiryModalOpen(false)}
                      className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-500 font-bold py-3 rounded-xl text-xs uppercase transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-[#201064] hover:bg-[#0A7FE6] text-white font-extrabold py-3 rounded-xl text-xs uppercase shadow-md transition cursor-pointer"
                    >
                      Submit Enquiry
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetails;
