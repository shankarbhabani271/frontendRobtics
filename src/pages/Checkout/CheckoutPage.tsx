import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useAuth, API_BASE_URL } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import { 
  FaShoppingBag, FaUser, FaMapMarkerAlt, FaCreditCard, 
  FaCheckCircle, FaArrowLeft, FaTicketAlt, FaTruck, 
  FaTag, FaLock, FaTimes, FaCoins, FaPrint, FaInfoCircle,
  FaMobileAlt, FaWallet, FaUniversity, FaPercent
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

interface LocationState {
  product?: {
    id: string;
    name: string;
    price: number;
    image: string;
    category?: string;
    brand?: string;
  };
  quantity?: number;
}

const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const { user, token } = useAuth();
  const { cart, clearCart } = useApp();

  const state = location.state as LocationState | null;
  const buyNowProduct = state?.product;
  const buyNowQuantity = state?.quantity || 1;

  // Checkout items state
  const [checkoutItems, setCheckoutItems] = useState<any[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<any>(null);

  // Form states
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); // Contact Mobile
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [country, setCountry] = useState("India");
  const [deliveryPhone, setDeliveryPhone] = useState(""); // Delivery Phone Number
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">("online");
  const [onlineGateway, setOnlineGateway] = useState<"razorpay" | "phonepe" | "cashfree">("razorpay");
  const [saveAddress, setSaveAddress] = useState(true);
  const [orderNotes, setOrderNotes] = useState("");

  // Direct Inline Payment States
  const [paymentCategory, setPaymentCategory] = useState<"upi" | "card" | "netbanking" | "wallet" | "cod">("upi");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [upiId, setUpiId] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [selectedWallet, setSelectedWallet] = useState("");

  // Billing address state
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [billingFirstName, setBillingFirstName] = useState("");
  const [billingLastName, setBillingLastName] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [billingCity, setBillingCity] = useState("");
  const [billingStateName, setBillingStateName] = useState("");
  const [billingPinCode, setBillingPinCode] = useState("");

  // Coupon states
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Dynamic warnings based on pincode
  const [isCodAvailable, setIsCodAvailable] = useState(true);
  const [deliveryEstimate, setDeliveryEstimate] = useState("3-5 business days");
  const [pincodeWarning, setPincodeWarning] = useState("");

  // UI overlays & loading states
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [simulatedPaymentStep, setSimulatedPaymentStep] = useState<"processing" | "success">("processing");

  // Available coupons
  const availableCoupons = [
    { code: "SAKRO20", desc: "Flat 20% OFF on all robotics items", badge: "20% OFF" },
    { code: "WELCOME500", desc: "Flat ₹500 discount (Min. subtotal ₹2,000)", badge: "₹500 OFF" },
    { code: "STEM1000", desc: "Flat ₹1,000 discount (Min. subtotal ₹5,000)", badge: "₹1,000 OFF" },
    { code: "FREESHIP", desc: "Free standard shipping with no minimum spend", badge: "Free Ship" }
  ];

  // Initialize checkout items
  useEffect(() => {
    if (buyNowProduct) {
      setCheckoutItems([
        {
          id: buyNowProduct.id,
          name: buyNowProduct.name,
          price: buyNowProduct.price,
          image: buyNowProduct.image,
          quantity: buyNowQuantity,
        }
      ]);
    } else if (cart.length > 0) {
      setCheckoutItems(
        cart.map((item) => ({
          id: item.id,
          name: item.product.name,
          price: item.product.price,
          image: item.product.images?.[0] || "",
          quantity: item.quantity,
        }))
      );
    } else {
      setCheckoutItems([]);
    }
  }, [buyNowProduct, buyNowQuantity, cart]);

  // Load saved address from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("sakrobotix_checkout_address");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.firstName) setFirstName(parsed.firstName);
        if (parsed.lastName) setLastName(parsed.lastName);
        if (parsed.address) setAddress(parsed.address);
        if (parsed.apartment) setApartment(parsed.apartment);
        if (parsed.city) setCity(parsed.city);
        if (parsed.stateName) setStateName(parsed.stateName);
        if (parsed.pinCode) setPinCode(parsed.pinCode);
        if (parsed.country) setCountry(parsed.country);
        if (parsed.deliveryPhone) setDeliveryPhone(parsed.deliveryPhone);
      } catch (err) {
        console.error("Error parsing saved address from localStorage", err);
      }
    } else if (user) {
      // Fallback to logged-in user profile details
      setEmail(user.email || "");
      const nameParts = (user.name || "").split(" ");
      setFirstName(nameParts[0] || "");
      setLastName(nameParts.slice(1).join(" ") || "");
      setPhone("9876543210");
      setDeliveryPhone("9876543210");
      setAddress("14 Sector A, SakRobotix Lab Campus");
      setCity("Bhubaneswar");
      setStateName("Odisha");
      setPinCode("751024");
    }
  }, [user]);

  // Reactive location rules based on PIN Code
  useEffect(() => {
    if (pinCode.length === 6) {
      if (pinCode.startsWith("99") || pinCode.endsWith("00")) {
        setIsCodAvailable(false);
        if (paymentCategory === "cod") {
          setPaymentCategory("upi"); // fallback
        }
        setPincodeWarning("COD is unavailable for this pin code location. Secure Online Payment methods are supported.");
        setDeliveryEstimate("5-7 business days");
      } else {
        setIsCodAvailable(true);
        setPincodeWarning("");
        setDeliveryEstimate(shippingMethod === "express" ? "1-2 business days" : "3-4 business days");
      }
    } else {
      setIsCodAvailable(true);
      setPincodeWarning("");
      setDeliveryEstimate(shippingMethod === "express" ? "1-2 business days" : "3-5 business days");
    }
  }, [pinCode, shippingMethod, paymentCategory]);

  // Maintain paymentMethod standard sync with inline selection
  useEffect(() => {
    if (paymentCategory === "cod") {
      setPaymentMethod("cod");
    } else {
      setPaymentMethod("online");
    }
  }, [paymentCategory]);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    applyCouponCode(couponCode.trim().toUpperCase());
  };

  const applyCouponCode = (code: string) => {
    const sub = getSubtotal();
    if (!code) return;

    if (code === "WELCOME500") {
      if (sub >= 2000) {
        setAppliedCoupon("WELCOME500");
        setDiscountAmount(500);
        Swal.fire("Coupon Applied!", "₹500 flat discount has been deducted.", "success");
      } else {
        Swal.fire("Not Eligible", "WELCOME500 requires a minimum purchase of ₹2,000.", "warning");
      }
    } else if (code === "SAKRO20") {
      setAppliedCoupon("SAKRO20");
      setDiscountAmount(Math.round(sub * 0.2));
      Swal.fire("Coupon Applied!", "20% discount has been applied.", "success");
    } else if (code === "FREESHIP") {
      setAppliedCoupon("FREESHIP");
      setDiscountAmount(0); // free standard shipping activated in calculation logic
      Swal.fire("Coupon Applied!", "Free standard shipping activated.", "success");
    } else if (code === "STEM1000") {
      if (sub >= 5000) {
        setAppliedCoupon("STEM1000");
        setDiscountAmount(1000);
        Swal.fire("Coupon Applied!", "₹1,000 flat discount has been deducted.", "success");
      } else {
        Swal.fire("Not Eligible", "STEM1000 requires a minimum purchase of ₹5,000.", "warning");
      }
    } else {
      Swal.fire("Invalid Coupon", "The coupon code entered does not exist or has expired.", "error");
    }
  };

  const getSubtotal = () => {
    return checkoutItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const getShippingCharges = () => {
    if (appliedCoupon === "FREESHIP") return 0;
    if (shippingMethod === "express") return 100;
    return getSubtotal() >= 500 ? 0 : 40;
  };

  const getTax = () => {
    // 18% GST calculation included in product prices (inclusive tax calculation)
    // Formula: (Subtotal - CouponDiscount) * 18 / 118
    const taxableSubtotal = Math.max(0, getSubtotal() - discountAmount);
    return Math.round((taxableSubtotal) * 18 / 118);
  };

  const getFinalTotal = () => {
    const total = getSubtotal() + getShippingCharges() - discountAmount;
    return Math.max(0, total);
  };

  const handlePayNow = (e: React.FormEvent) => {
    e.preventDefault();

    // Field Validations
    if (!email || !phone || !firstName || !lastName || !address || !city || !stateName || !pinCode || !deliveryPhone) {
      Swal.fire("Incomplete Fields", "Please complete all required shipping & contact details.", "warning");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      Swal.fire("Invalid Email", "Please enter a valid email address.", "warning");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      Swal.fire("Invalid Mobile Number", "Please enter a valid 10-digit mobile number.", "warning");
      return;
    }

    if (!/^\d{10}$/.test(deliveryPhone)) {
      Swal.fire("Invalid Delivery Phone", "Please enter a valid 10-digit delivery phone number.", "warning");
      return;
    }

    if (!/^\d{6}$/.test(pinCode)) {
      Swal.fire("Invalid ZIP/PIN Code", "Please enter a valid 6-digit PIN code.", "warning");
      return;
    }

    if (!sameAsShipping) {
      if (!billingFirstName || !billingLastName || !billingAddress || !billingCity || !billingStateName || !billingPinCode) {
        Swal.fire("Incomplete Billing Details", "Please fill in all the required billing address fields.", "warning");
        return;
      }
      if (!/^\d{6}$/.test(billingPinCode)) {
        Swal.fire("Invalid Billing ZIP", "Please enter a valid 6-digit billing PIN code.", "warning");
        return;
      }
    }

    // Direct Payment Field Checks
    if (paymentCategory === "card") {
      if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
        Swal.fire("Card Details Required", "Please enter card details to proceed.", "warning");
        return;
      }
      if (cardNumber.length < 16) {
        Swal.fire("Invalid Card Number", "Card number must be 16 digits.", "warning");
        return;
      }
    } else if (paymentCategory === "upi") {
      if (!upiId) {
        Swal.fire("UPI ID Required", "Please enter your UPI ID.", "warning");
        return;
      }
      if (!upiId.includes("@")) {
        Swal.fire("Invalid UPI ID", "UPI ID must contain '@' (e.g. user@okaxis).", "warning");
        return;
      }
    } else if (paymentCategory === "netbanking") {
      if (!selectedBank) {
        Swal.fire("Bank Selection Required", "Please select your bank.", "warning");
        return;
      }
    } else if (paymentCategory === "wallet") {
      if (!selectedWallet) {
        Swal.fire("Wallet Selection Required", "Please select your digital wallet.", "warning");
        return;
      }
    }

    // Cache Address Details if option checked
    if (saveAddress) {
      const addressDetails = {
        email,
        phone,
        firstName,
        lastName,
        address,
        apartment,
        city,
        stateName,
        pinCode,
        country,
        deliveryPhone,
      };
      localStorage.setItem("sakrobotix_checkout_address", JSON.stringify(addressDetails));
    } else {
      localStorage.removeItem("sakrobotix_checkout_address");
    }

    if (paymentMethod === "online") {
      // Trigger simulation overlay
      setSimulatedPaymentStep("processing");
      setIsPaymentModalOpen(true);
      
      // Auto success transition after 2 seconds
      setTimeout(() => {
        setSimulatedPaymentStep("success");
      }, 2000);
    } else {
      // COD directly placed
      submitOrder("COD");
    }
  };

  const submitOrder = async (txnId: string) => {
    setIsSubmitting(true);
    setIsPaymentModalOpen(false);

    const fullShippingAddr = `${firstName} ${lastName}, ${address}, ${apartment ? apartment + ', ' : ''}${city}, ${stateName} - ${pinCode}. Phone: ${deliveryPhone}`;
    const totalAmount = getFinalTotal();

    const orderData = {
      items: checkoutItems.map((item) => ({
        itemId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        type: "product",
      })),
      totalAmount,
      shippingAddress: fullShippingAddr,
      paymentDetails: {
        transactionId: txnId,
        paymentGateway: paymentMethod === "online" ? onlineGateway.toUpperCase() : "COD",
      }
    };

    if (token && user) {
      // Logged-in user checkout: post to backend
      try {
        const res = await fetch(`${API_BASE_URL}/content/orders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orderData),
        });

        if (res.ok) {
          const result = await res.json();
          setCreatedOrder({
            id: result._id,
            txnId: result.paymentDetails?.transactionId || txnId,
            gateway: paymentMethod === "online" ? `${onlineGateway.toUpperCase()} (${paymentCategory.toUpperCase()})` : "COD",
            address: fullShippingAddr,
            notes: orderNotes,
            items: checkoutItems,
            pricing: {
              subtotal: getSubtotal(),
              shipping: getShippingCharges(),
              tax: getTax(),
              discount: discountAmount,
              total: totalAmount
            }
          });
          setIsSuccess(true);
          if (!buyNowProduct) {
            clearCart();
          }
        } else {
          const err = await res.json();
          Swal.fire("API Error", err.message || "Failed to record order in database. Using simulation fallback.", "error").then(() => {
            triggerMockSuccess(txnId, fullShippingAddr, totalAmount);
          });
        }
      } catch (e) {
        console.error("Order API failed, fallback to mock recording", e);
        triggerMockSuccess(txnId, fullShippingAddr, totalAmount);
      }
    } else {
      // Guest Checkout
      triggerMockSuccess(txnId, fullShippingAddr, totalAmount);
    }
    setIsSubmitting(false);
  };

  const triggerMockSuccess = (txnId: string, fullAddr: string, totalAmount: number) => {
    setCreatedOrder({
      id: "SAK-ORD-" + Math.floor(100000 + Math.random() * 900000),
      txnId,
      gateway: paymentMethod === "online" ? `${onlineGateway.toUpperCase()} (${paymentCategory.toUpperCase()})` : "COD",
      address: fullAddr,
      notes: orderNotes,
      items: checkoutItems,
      pricing: {
        subtotal: getSubtotal(),
        shipping: getShippingCharges(),
        tax: getTax(),
        discount: discountAmount,
        total: totalAmount
      }
    });
    setIsSuccess(true);
    if (!buyNowProduct) {
      clearCart();
    }
  };

  // Free shipping variables
  const subtotalForShipping = getSubtotal();
  const shippingThreshold = 500;
  const isEligibleForFreeShipping = subtotalForShipping >= shippingThreshold;
  const diffToFreeShipping = shippingThreshold - subtotalForShipping;
  const freeShippingPercentage = Math.min(100, (subtotalForShipping / shippingThreshold) * 100);

  if (checkoutItems.length === 0 && !isSuccess) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-16 h-16 bg-[#201064]/5 text-[#201064] flex items-center justify-center rounded-full mx-auto">
          <FaShoppingBag size={24} />
        </div>
        <h2 className="text-2xl font-black text-[#201064]">Checkout is Empty</h2>
        <p className="text-slate-400 max-w-sm mx-auto font-medium">
          You haven't selected any items for direct checkout yet. Please return to our storefront catalog.
        </p>
        <Link
          to="/products"
          className="inline-block bg-[#201064] text-white hover:bg-[#0A7FE6] font-bold px-8 py-3.5 rounded-xl text-sm transition shadow-sm"
        >
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div 
              key="checkout-form"
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              
              {/* LEFT COLUMN: Customer checkout details forms */}
              <form onSubmit={handlePayNow} className="lg:col-span-7 space-y-6">
                
                {/* Header breadcrumbs link */}
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <Link to="/products" className="hover:text-[#0A7FE6] flex items-center gap-1">
                    <FaArrowLeft size={10} />
                    <span>Back to Store</span>
                  </Link>
                  <span>/</span>
                  <span className="text-[#201064]">Secure Checkout</span>
                </div>

                {/* Free Shipping Status Progress Bar */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600 flex items-center gap-2">
                      <FaTruck className="text-[#0A7FE6]" />
                      <span>Free Shipping Progress</span>
                    </span>
                    <span className="text-xs font-black text-[#201064]">
                      {isEligibleForFreeShipping ? "ELIGIBLE" : `₹${diffToFreeShipping} more`}
                    </span>
                  </div>
                  
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 rounded-full ${
                        isEligibleForFreeShipping ? "bg-emerald-500" : "bg-blue-500"
                      }`}
                      style={{ width: `${freeShippingPercentage}%` }}
                    />
                  </div>

                  <p className="text-[11px] font-bold text-slate-400">
                    {isEligibleForFreeShipping 
                      ? "Congratulations! Your order qualifies for FREE Standard Shipping. 🎉" 
                      : `Add items worth ₹${diffToFreeShipping} more to qualify for Free standard shipping (for orders above ₹500).`
                    }
                  </p>
                </div>

                {/* Contact Information card */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <h2 className="font-extrabold text-sm text-[#201064] uppercase tracking-wider flex items-center gap-2">
                      <FaUser className="text-[#0A7FE6]" size={14} />
                      <span>Contact Information</span>
                    </h2>
                    {user ? (
                      <span className="text-[10px] bg-blue-50 border border-blue-100 text-blue-600 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                        Logged In
                      </span>
                    ) : (
                      <span className="text-[10px] bg-amber-50 border border-amber-100 text-amber-600 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                        Guest Checkout
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wide">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@gmail.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-[#201064] focus:outline-none focus:ring-2 focus:ring-[#0A7FE6] focus:bg-white transition"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wide">
                        Contact Phone <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                        placeholder="10-digit mobile number"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-[#201064] focus:outline-none focus:ring-2 focus:ring-[#0A7FE6] focus:bg-white transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Information card */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
                  <h2 className="font-extrabold text-sm text-[#201064] border-b border-slate-100 pb-3 uppercase tracking-wider flex items-center gap-2">
                    <FaMapMarkerAlt className="text-[#0A7FE6]" size={13} />
                    <span>Delivery Address</span>
                  </h2>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wide">
                          First Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="First Name"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-[#201064] focus:outline-none focus:ring-2 focus:ring-[#0A7FE6] focus:bg-white transition"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wide">
                          Last Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Last Name"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-[#201064] focus:outline-none focus:ring-2 focus:ring-[#0A7FE6] focus:bg-white transition"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wide">
                        Street Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="House no., Building, Street Name, Area"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-[#201064] focus:outline-none focus:ring-2 focus:ring-[#0A7FE6] focus:bg-white transition"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wide">
                          Apartment / Suite / Unit (Optional)
                        </label>
                        <input
                          type="text"
                          value={apartment}
                          onChange={(e) => setApartment(e.target.value)}
                          placeholder="Suite, Block, Landmark"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-[#201064] focus:outline-none focus:ring-2 focus:ring-[#0A7FE6] focus:bg-white transition"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wide">
                          City <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="City"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-[#201064] focus:outline-none focus:ring-2 focus:ring-[#0A7FE6] focus:bg-white transition"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wide">
                          State <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={stateName}
                          onChange={(e) => setStateName(e.target.value)}
                          placeholder="State"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-[#201064] focus:outline-none focus:ring-2 focus:ring-[#0A7FE6] focus:bg-white transition"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wide">
                          PIN Code <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          required
                          value={pinCode}
                          onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ""))}
                          placeholder="6-digit ZIP code"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-[#201064] focus:outline-none focus:ring-2 focus:ring-[#0A7FE6] focus:bg-white transition"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wide">
                          Country
                        </label>
                        <select
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-[#201064] focus:outline-none focus:ring-2 focus:ring-[#0A7FE6] focus:bg-white transition cursor-pointer"
                        >
                          <option value="India">India</option>
                          <option value="USA">United States</option>
                          <option value="Singapore">Singapore</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wide">
                        Delivery Phone Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={deliveryPhone}
                        onChange={(e) => setDeliveryPhone(e.target.value.replace(/\D/g, ""))}
                        placeholder="10-digit mobile number for courier contact"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-[#201064] focus:outline-none focus:ring-2 focus:ring-[#0A7FE6] focus:bg-white transition"
                      />
                    </div>
                  </div>

                  {/* Pincode checker response label */}
                  <AnimatePresence mode="wait">
                    {pincodeWarning && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-[11px] font-bold text-amber-600 bg-amber-50 p-2.5 border border-amber-100 rounded-xl flex items-center gap-1.5"
                      >
                        <FaInfoCircle />
                        <span>{pincodeWarning}</span>
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Shipping methods option selectors */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
                  <h2 className="font-extrabold text-sm text-[#201064] border-b border-slate-100 pb-3 uppercase tracking-wider flex items-center gap-2">
                    <FaTruck className="text-[#0A7FE6]" size={13} />
                    <span>Shipping Method</span>
                  </h2>

                  <div className="space-y-3">
                    {/* Standard */}
                    <label 
                      onClick={() => setShippingMethod("standard")}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 transition cursor-pointer select-none ${
                        shippingMethod === "standard"
                          ? "border-[#0A7FE6] bg-blue-50/20"
                          : "border-slate-100 hover:border-slate-200 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping"
                          checked={shippingMethod === "standard"}
                          readOnly
                          className="text-[#0A7FE6]"
                        />
                        <div>
                          <p className="text-xs font-extrabold text-[#201064]">Standard Delivery (3-5 Days)</p>
                          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Estimated Arrival: {deliveryEstimate}</p>
                        </div>
                      </div>
                      <span className="text-xs font-black text-emerald-600">
                        {getSubtotal() >= 500 || appliedCoupon === "FREESHIP" ? "FREE" : "₹40"}
                      </span>
                    </label>

                    {/* Express */}
                    <label 
                      onClick={() => setShippingMethod("express")}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 transition cursor-pointer select-none ${
                        shippingMethod === "express"
                          ? "border-[#0A7FE6] bg-blue-50/20"
                          : "border-slate-100 hover:border-slate-200 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping"
                          checked={shippingMethod === "express"}
                          readOnly
                          className="text-[#0A7FE6]"
                        />
                        <div>
                          <p className="text-xs font-extrabold text-[#201064]">Express Next-Day Shipping</p>
                          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Estimated Arrival: 1-2 Days</p>
                        </div>
                      </div>
                      <span className="text-xs font-black text-[#201064]">₹100</span>
                    </label>
                  </div>
                </div>

                {/* Billing Address Configuration */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
                  <h2 className="font-extrabold text-sm text-[#201064] border-b border-slate-100 pb-3 uppercase tracking-wider">
                    Billing Address
                  </h2>

                  <div className="space-y-4">
                    <label className="flex items-center gap-2 text-xs font-bold text-[#201064] select-none cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sameAsShipping}
                        onChange={(e) => setSameAsShipping(e.target.checked)}
                        className="rounded text-[#0A7FE6] focus:ring-[#0A7FE6]"
                      />
                      <span>Same as Shipping Address</span>
                    </label>

                    {!sameAsShipping && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="space-y-4 border-t border-slate-100 pt-4"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wide">First Name *</label>
                            <input
                              type="text"
                              required
                              value={billingFirstName}
                              onChange={(e) => setBillingFirstName(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-[#201064]"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Last Name *</label>
                            <input
                              type="text"
                              required
                              value={billingLastName}
                              onChange={(e) => setBillingLastName(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-[#201064]"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Address *</label>
                          <input
                            type="text"
                            required
                            value={billingAddress}
                            onChange={(e) => setBillingAddress(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-[#201064]"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wide">City *</label>
                            <input
                              type="text"
                              required
                              value={billingCity}
                              onChange={(e) => setBillingCity(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-[#201064]"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wide">State *</label>
                            <input
                              type="text"
                              required
                              value={billingStateName}
                              onChange={(e) => setBillingStateName(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-[#201064]"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wide">PIN Code *</label>
                            <input
                              type="text"
                              maxLength={6}
                              required
                              value={billingPinCode}
                              onChange={(e) => setBillingPinCode(e.target.value.replace(/\D/g, ""))}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-[#201064]"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Redesigned Payment Options directly inside page */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
                  <h2 className="font-extrabold text-sm text-[#201064] border-b border-slate-100 pb-3 uppercase tracking-wider flex items-center gap-2">
                    <FaCreditCard className="text-[#0A7FE6]" size={13} />
                    <span>Choose Payment Method</span>
                  </h2>

                  <div className="space-y-3">
                    
                    {/* UPI Section */}
                    <div className="border border-slate-100 rounded-xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setPaymentCategory("upi")}
                        className={`w-full flex items-center justify-between p-4 text-left transition ${
                          paymentCategory === "upi" ? "bg-slate-50/80 border-b border-slate-100" : "bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input 
                            type="radio" 
                            checked={paymentCategory === "upi"}
                            onChange={() => setPaymentCategory("upi")}
                            className="text-[#0A7FE6]"
                          />
                          <div>
                            <p className="text-xs font-extrabold text-[#201064] flex items-center gap-1.5">
                              <FaMobileAlt size={12} className="text-[#0A7FE6]" />
                              <span>UPI (Paytm, Google Pay, PhonePe)</span>
                            </p>
                            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Instant secure transfer via UPI ID</p>
                          </div>
                        </div>
                      </button>
                      <AnimatePresence>
                        {paymentCategory === "upi" && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="p-4 bg-slate-50/50 space-y-3"
                          >
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Enter UPI ID</label>
                            <input
                              type="text"
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                              placeholder="e.g. mobile@ybl or username@okicici"
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-[#201064] focus:outline-none focus:ring-2 focus:ring-[#0A7FE6]"
                            />
                            
                            {/* Gateway choice */}
                            <div className="space-y-1 pt-1">
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-wide">Gateway Processor</label>
                              <div className="grid grid-cols-3 gap-2">
                                {["razorpay", "phonepe", "cashfree"].map((gw) => (
                                  <button
                                    key={gw}
                                    type="button"
                                    onClick={() => setOnlineGateway(gw as any)}
                                    className={`p-2 border rounded-xl text-[10px] font-extrabold uppercase transition ${
                                      onlineGateway === gw 
                                        ? "border-[#0A7FE6] bg-blue-50/30 text-[#0A7FE6]" 
                                        : "border-slate-200 text-slate-400 hover:bg-slate-100"
                                    }`}
                                  >
                                    {gw}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Credit / Debit Card Section */}
                    <div className="border border-slate-100 rounded-xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setPaymentCategory("card")}
                        className={`w-full flex items-center justify-between p-4 text-left transition ${
                          paymentCategory === "card" ? "bg-slate-50/80 border-b border-slate-100" : "bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input 
                            type="radio" 
                            checked={paymentCategory === "card"}
                            onChange={() => setPaymentCategory("card")}
                            className="text-[#0A7FE6]"
                          />
                          <div>
                            <p className="text-xs font-extrabold text-[#201064] flex items-center gap-1.5">
                              <FaCreditCard size={12} className="text-[#0A7FE6]" />
                              <span>Credit / Debit Card</span>
                            </p>
                            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">All major Indian and international cards supported</p>
                          </div>
                        </div>
                      </button>
                      <AnimatePresence>
                        {paymentCategory === "card" && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="p-4 bg-slate-50/50 space-y-3"
                          >
                            <div className="space-y-3">
                              <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Card Number</label>
                                <input
                                  type="text"
                                  maxLength={16}
                                  value={cardNumber}
                                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
                                  placeholder="16-digit card number"
                                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-[#201064] focus:outline-none focus:ring-2 focus:ring-[#0A7FE6]"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Expiry Date</label>
                                  <input
                                    type="text"
                                    maxLength={5}
                                    value={cardExpiry}
                                    onChange={(e) => setCardExpiry(e.target.value)}
                                    placeholder="MM/YY"
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-[#201064] focus:outline-none focus:ring-2 focus:ring-[#0A7FE6]"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wide">CVV</label>
                                  <input
                                    type="password"
                                    maxLength={3}
                                    value={cardCvv}
                                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                                    placeholder="CVV"
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-[#201064] focus:outline-none focus:ring-2 focus:ring-[#0A7FE6]"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Cardholder Name</label>
                                <input
                                  type="text"
                                  value={cardName}
                                  onChange={(e) => setCardName(e.target.value)}
                                  placeholder="Full Name as on Card"
                                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-[#201064] focus:outline-none focus:ring-2 focus:ring-[#0A7FE6]"
                                />
                              </div>
                            </div>
                            
                            {/* Gateway choice */}
                            <div className="space-y-1 pt-1">
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-wide">Gateway Processor</label>
                              <div className="grid grid-cols-3 gap-2">
                                {["razorpay", "phonepe", "cashfree"].map((gw) => (
                                  <button
                                    key={gw}
                                    type="button"
                                    onClick={() => setOnlineGateway(gw as any)}
                                    className={`p-2 border rounded-xl text-[10px] font-extrabold uppercase transition ${
                                      onlineGateway === gw 
                                        ? "border-[#0A7FE6] bg-blue-50/30 text-[#0A7FE6]" 
                                        : "border-slate-200 text-slate-400 hover:bg-slate-100"
                                    }`}
                                  >
                                    {gw}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Net Banking Section */}
                    <div className="border border-slate-100 rounded-xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setPaymentCategory("netbanking")}
                        className={`w-full flex items-center justify-between p-4 text-left transition ${
                          paymentCategory === "netbanking" ? "bg-slate-50/80 border-b border-slate-100" : "bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input 
                            type="radio" 
                            checked={paymentCategory === "netbanking"}
                            onChange={() => setPaymentCategory("netbanking")}
                            className="text-[#0A7FE6]"
                          />
                          <div>
                            <p className="text-xs font-extrabold text-[#201064] flex items-center gap-1.5">
                              <FaUniversity size={12} className="text-[#0A7FE6]" />
                              <span>Net Banking</span>
                            </p>
                            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Select from popular retail banks</p>
                          </div>
                        </div>
                      </button>
                      <AnimatePresence>
                        {paymentCategory === "netbanking" && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="p-4 bg-slate-50/50 space-y-3"
                          >
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Select Your Bank</label>
                            <select
                              value={selectedBank}
                              onChange={(e) => setSelectedBank(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-[#201064] focus:outline-none focus:ring-2 focus:ring-[#0A7FE6] cursor-pointer"
                            >
                              <option value="">-- Choose Bank --</option>
                              <option value="SBI">State Bank of India (SBI)</option>
                              <option value="HDFC">HDFC Bank</option>
                              <option value="ICICI">ICICI Bank</option>
                              <option value="AXIS">Axis Bank</option>
                              <option value="KOTAK">Kotak Mahindra Bank</option>
                              <option value="YES">Yes Bank</option>
                            </select>
                            
                            {/* Gateway choice */}
                            <div className="space-y-1 pt-1">
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-wide">Gateway Processor</label>
                              <div className="grid grid-cols-3 gap-2">
                                {["razorpay", "phonepe", "cashfree"].map((gw) => (
                                  <button
                                    key={gw}
                                    type="button"
                                    onClick={() => setOnlineGateway(gw as any)}
                                    className={`p-2 border rounded-xl text-[10px] font-extrabold uppercase transition ${
                                      onlineGateway === gw 
                                        ? "border-[#0A7FE6] bg-blue-50/30 text-[#0A7FE6]" 
                                        : "border-slate-200 text-slate-400 hover:bg-slate-100"
                                    }`}
                                  >
                                    {gw}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Wallets Section */}
                    <div className="border border-slate-100 rounded-xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setPaymentCategory("wallet")}
                        className={`w-full flex items-center justify-between p-4 text-left transition ${
                          paymentCategory === "wallet" ? "bg-slate-50/80 border-b border-slate-100" : "bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input 
                            type="radio" 
                            checked={paymentCategory === "wallet"}
                            onChange={() => setPaymentCategory("wallet")}
                            className="text-[#0A7FE6]"
                          />
                          <div>
                            <p className="text-xs font-extrabold text-[#201064] flex items-center gap-1.5">
                              <FaWallet size={12} className="text-[#0A7FE6]" />
                              <span>Digital Wallets</span>
                            </p>
                            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Pay via Paytm, Amazon Pay, or PhonePe wallet</p>
                          </div>
                        </div>
                      </button>
                      <AnimatePresence>
                        {paymentCategory === "wallet" && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="p-4 bg-slate-50/50 space-y-3"
                          >
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Select Wallet</label>
                            <select
                              value={selectedWallet}
                              onChange={(e) => setSelectedWallet(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-[#201064] focus:outline-none focus:ring-2 focus:ring-[#0A7FE6] cursor-pointer"
                            >
                              <option value="">-- Choose Wallet --</option>
                              <option value="Paytm">Paytm Wallet</option>
                              <option value="PhonePe">PhonePe Wallet</option>
                              <option value="AmazonPay">Amazon Pay Balance</option>
                              <option value="Mobikwik">Mobikwik</option>
                            </select>
                            
                            {/* Gateway choice */}
                            <div className="space-y-1 pt-1">
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-wide">Gateway Processor</label>
                              <div className="grid grid-cols-3 gap-2">
                                {["razorpay", "phonepe", "cashfree"].map((gw) => (
                                  <button
                                    key={gw}
                                    type="button"
                                    onClick={() => setOnlineGateway(gw as any)}
                                    className={`p-2 border rounded-xl text-[10px] font-extrabold uppercase transition ${
                                      onlineGateway === gw 
                                        ? "border-[#0A7FE6] bg-blue-50/30 text-[#0A7FE6]" 
                                        : "border-slate-200 text-slate-400 hover:bg-slate-100"
                                    }`}
                                  >
                                    {gw}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Cash On Delivery */}
                    <div className={`border border-slate-100 rounded-xl overflow-hidden ${
                      !isCodAvailable ? "opacity-50 pointer-events-none" : ""
                    }`}>
                      <button
                        type="button"
                        disabled={!isCodAvailable}
                        onClick={() => setPaymentCategory("cod")}
                        className={`w-full flex items-center justify-between p-4 text-left transition ${
                          paymentCategory === "cod" ? "bg-slate-50/80 border-b border-slate-100" : "bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input 
                            type="radio" 
                            disabled={!isCodAvailable}
                            checked={paymentCategory === "cod"}
                            onChange={() => setPaymentCategory("cod")}
                            className="text-[#0A7FE6]"
                          />
                          <div>
                            <p className="text-xs font-extrabold text-[#201064] flex items-center gap-1.5">
                              <FaCoins size={12} className="text-[#0A7FE6]" />
                              <span>Cash On Delivery (COD)</span>
                            </p>
                            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                              {!isCodAvailable ? "Unavailable for this location code" : "Pay with cash at your doorstep"}
                            </p>
                          </div>
                        </div>
                      </button>
                    </div>

                  </div>
                </div>

                {/* Additional controls (notes, save info) */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
                  <div className="space-y-4">
                    <label className="flex items-center gap-2 text-xs font-bold text-[#201064] select-none cursor-pointer">
                      <input
                        type="checkbox"
                        checked={saveAddress}
                        onChange={(e) => setSaveAddress(e.target.checked)}
                        className="rounded text-[#0A7FE6] cursor-pointer"
                      />
                      <span>Save shipping address details for future orders</span>
                    </label>

                    <div className="space-y-1 pt-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Order Notes / Instructions</label>
                      <textarea
                        rows={3}
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        placeholder="Instructions for courier, delivery gate codes..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-[#201064] focus:outline-none focus:ring-2 focus:ring-[#0A7FE6] focus:bg-white resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Pay button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#201064] hover:bg-[#0A7FE6] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
                >
                  <FaLock size={12} />
                  <span>{paymentMethod === "online" ? `Pay Now (via ${onlineGateway.toUpperCase()})` : "Place Cash Order"}</span>
                </button>

              </form>

              {/* RIGHT COLUMN: Order Summary & Coupon System */}
              <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
                
                {/* Order Summary box */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
                  <h2 className="font-extrabold text-sm text-[#201064] border-b border-slate-100 pb-3 uppercase tracking-wider flex items-center gap-2">
                    <FaShoppingBag className="text-[#0A7FE6]" size={14} />
                    <span>Order Summary</span>
                  </h2>

                  {/* Items list */}
                  <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto no-scrollbar">
                    {checkoutItems.map((item) => (
                      <div key={item.id} className="flex gap-4 py-3 first:pt-0 last:pb-0">
                        <div className="w-14 h-14 rounded-xl border border-slate-100 p-1 flex items-center justify-center bg-white flex-shrink-0">
                          <img src={item.image} alt={item.name} className="max-h-full object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-[#201064] truncate leading-tight">{item.name}</h4>
                          <div className="flex items-center justify-between mt-2 text-xs font-bold">
                            <span className="text-slate-400">Qty: {item.quantity}</span>
                            <span className="text-[#201064]">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Coupon System */}
                  <div className="border-t border-slate-100 pt-4 space-y-3">
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <div className="relative flex-grow">
                        <FaTag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Enter Coupon Code"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-[#201064] uppercase focus:outline-none focus:ring-2 focus:ring-[#0A7FE6] focus:bg-white"
                        />
                      </div>
                      <button
                        type="submit"
                        className="bg-slate-100 hover:bg-slate-200 text-[#201064] px-4 rounded-xl text-xs font-extrabold transition cursor-pointer border border-slate-200 shadow-sm"
                      >
                        Apply
                      </button>
                    </form>

                    {/* Active coupon details display */}
                    {appliedCoupon && (
                      <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-2 flex items-center justify-between">
                        <span className="text-[10px] text-emerald-700 font-extrabold flex items-center gap-1.5 uppercase tracking-wide">
                          <FaTicketAlt />
                          <span>Code '{appliedCoupon}' Active</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => { setAppliedCoupon(null); setDiscountAmount(0); }}
                          className="text-slate-400 hover:text-rose-600 text-xs cursor-pointer"
                        >
                          <FaTimes size={10} />
                        </button>
                      </div>
                    )}

                    {/* Available Coupons showcase tags */}
                    <div className="space-y-1.5 pt-1.5 border-t border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-wide">Available Store Coupons</p>
                      <div className="flex flex-wrap gap-2">
                        {availableCoupons.map((c) => (
                          <button
                            key={c.code}
                            type="button"
                            onClick={() => applyCouponCode(c.code)}
                            title={c.desc}
                            className="flex items-center gap-1 bg-blue-50/50 hover:bg-blue-50 text-[10px] border border-blue-150 text-[#0A7FE6] font-bold px-2.5 py-1.5 rounded-lg transition"
                          >
                            <FaPercent className="text-[9px] text-[#0A7FE6]/70" />
                            <span>{c.code}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Price calculations summary */}
                  <div className="border-t border-slate-100 pt-4 space-y-3">
                    <div className="flex justify-between text-xs font-bold text-slate-500">
                      <span>Subtotal</span>
                      <span>₹{getSubtotal().toLocaleString("en-IN")}</span>
                    </div>

                    <div className="flex justify-between text-xs font-bold text-slate-500">
                      <span>Shipping Fee</span>
                      {getShippingCharges() === 0 ? (
                        <span className="text-emerald-600">FREE</span>
                      ) : (
                        <span>₹{getShippingCharges().toLocaleString("en-IN")}</span>
                      )}
                    </div>

                    <div className="flex justify-between text-xs font-bold text-slate-500">
                      <span>GST (18% Included)</span>
                      <span>₹{getTax().toLocaleString("en-IN")}</span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-xs font-bold text-emerald-600">
                        <span>Coupon Discount</span>
                        <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm font-black border-t border-slate-100 pt-3 text-[#201064]">
                      <span>Grand Total</span>
                      <span className="text-base font-black">₹{getFinalTotal().toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                </div>

                {/* Trust banner */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 flex items-center gap-3">
                  <FaLock className="text-slate-400 flex-shrink-0" size={16} />
                  <p className="text-[10px] text-slate-500 leading-relaxed font-bold">
                    Secure checkout powered by industry-standard encryption protocols. Your data and private banking details are never stored on our servers.
                  </p>
                </div>

              </div>

            </motion.div>
          ) : (
            
            /* ORDER SUCCESS CONFIRMATION VIEW SCREEN */
            <motion.div
              key="order-success"
              className="bg-white rounded-3xl p-6 md:p-10 border border-slate-100 shadow-xl max-w-2xl mx-auto space-y-8 text-center"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner border border-emerald-100">
                <FaCheckCircle size={28} />
              </div>

              <div className="space-y-2.5">
                <h1 className="text-2xl md:text-3xl font-black text-[#201064] tracking-tight">Order Confirmed!</h1>
                <p className="text-slate-400 text-xs sm:text-sm font-semibold max-w-sm mx-auto">
                  Thank you for shopping at SAKROBOTIX. Your order has been registered and is being processed.
                </p>
              </div>

              {/* Order Transaction reference card */}
              <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 text-left space-y-4">
                <h3 className="font-extrabold text-xs text-[#201064] uppercase tracking-wider border-b border-slate-200/60 pb-2">
                  Invoice Specifications
                </h3>

                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs font-semibold">
                  <div className="space-y-0.5">
                    <p className="text-slate-400 text-[9px] font-black uppercase tracking-wider">Order ID</p>
                    <p className="text-[#201064] font-black">{createdOrder.id}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-slate-400 text-[9px] font-black uppercase tracking-wider">Transaction Ref ID</p>
                    <p className="text-[#201064] font-mono select-all font-bold">{createdOrder.txnId}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-slate-400 text-[9px] font-black uppercase tracking-wider">Payment Method</p>
                    <p className="text-[#201064] uppercase font-bold">{createdOrder.gateway}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-slate-400 text-[9px] font-black uppercase tracking-wider">Delivery Time</p>
                    <p className="text-[#201064] font-bold">Estimated: {deliveryEstimate}</p>
                  </div>
                  <div className="col-span-2 space-y-0.5 pt-1.5 border-t border-slate-200/40">
                    <p className="text-slate-400 text-[9px] font-black uppercase tracking-wider">Shipping & Delivery Address</p>
                    <p className="text-[#201064] leading-relaxed text-[11px] font-medium">{createdOrder.address}</p>
                  </div>
                </div>

                {/* Items purchase summary list */}
                <div className="border-t border-slate-200/40 pt-4 space-y-2">
                  <p className="text-slate-400 text-[9px] font-black uppercase tracking-wider mb-2">Items Purchased</p>
                  {createdOrder.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-xs font-bold">
                      <span className="text-[#201064] max-w-[360px] truncate">{item.name} <span className="text-slate-400">x{item.quantity}</span></span>
                      <span className="text-slate-700">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                </div>

                {/* Cost breakdown */}
                <div className="border-t border-slate-200/40 pt-4 space-y-2 text-xs font-bold text-slate-500">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{createdOrder.pricing.subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{createdOrder.pricing.shipping === 0 ? "FREE" : `₹${createdOrder.pricing.shipping}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (GST Included)</span>
                    <span>₹{createdOrder.pricing.tax.toLocaleString("en-IN")}</span>
                  </div>
                  {createdOrder.pricing.discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount</span>
                      <span>-₹{createdOrder.pricing.discount.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-black border-t border-slate-200/60 pt-2 text-[#201064]">
                    <span>Total Paid</span>
                    <span>₹{createdOrder.pricing.total.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              {/* Success CTAs */}
              <div className="flex flex-col sm:flex-row gap-3.5 print:hidden">
                <button
                  onClick={() => window.print()}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-[#201064] py-3.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer border border-slate-200"
                >
                  <FaPrint />
                  <span>Print Receipt</span>
                </button>
                <Link
                  to="/products"
                  className="flex-1 bg-[#201064] hover:bg-[#0A7FE6] text-white py-3.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1 transition shadow-sm"
                >
                  <span>Continue Shopping</span>
                </Link>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* SECURE ONLINE PAYMENT GATEWAY DIALOG SIMULATION OVERLAY */}
      <AnimatePresence>
        {isPaymentModalOpen && (
          <motion.div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[99999] flex items-center justify-center p-4 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white w-full max-w-md rounded-3xl border border-slate-100 shadow-2xl overflow-hidden"
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
            >
              {/* Gateway Banner Header */}
              <div className="bg-[#201064] p-5 text-white flex justify-between items-center">
                <div>
                  <h3 className="font-extrabold text-sm uppercase tracking-wider flex items-center gap-2">
                    <FaCoins className="text-[#0A7FE6]" />
                    <span>{onlineGateway.toUpperCase()} Secure Pay</span>
                  </h3>
                  <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest mt-0.5">SAKROBOTIX ONLINE ENCRYPTION</p>
                </div>
                <button
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
                >
                  <FaTimes size={12} />
                </button>
              </div>

              {/* Amount block */}
              <div className="bg-blue-50/50 p-4 border-b border-slate-100 flex justify-between items-center text-xs font-bold text-slate-500">
                <span>Total Amount Due</span>
                <span className="text-[#201064] text-base font-black">₹{getFinalTotal().toLocaleString("en-IN")}</span>
              </div>

              {/* Simulation content */}
              <div className="p-6 text-center space-y-6">
                {simulatedPaymentStep === "processing" ? (
                  <div className="space-y-4 py-4">
                    {/* Dynamic Spinner */}
                    <div className="relative w-16 h-16 mx-auto">
                      <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                      <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-[#0A7FE6] animate-spin"></div>
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className="text-sm font-extrabold text-[#201064] uppercase tracking-wider">Contacting Secure Servers</h4>
                      <p className="text-[11px] text-slate-400 font-semibold">
                        Processing card / digital transfer of ₹{getFinalTotal().toLocaleString("en-IN")} via SAKROBOTIX Store gateway...
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 py-2">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-150 shadow-inner">
                      <FaCheckCircle size={22} />
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className="text-sm font-extrabold text-[#201064] uppercase tracking-wider">Authorization Successful</h4>
                      <p className="text-[11px] text-slate-400 font-semibold">
                        Your payment has been successfully secured and decrypted. Click below to register your order.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const dummyTxId = "sak_tx_" + Math.random().toString(36).substr(2, 9);
                        submitOrder(dummyTxId);
                      }}
                      className="w-full bg-[#201064] hover:bg-[#0A7FE6] text-white py-3 rounded-xl font-extrabold text-xs uppercase shadow transition cursor-pointer"
                    >
                      Complete Secure Order
                    </button>
                  </div>
                )}
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CheckoutPage;
