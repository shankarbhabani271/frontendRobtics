import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import logo2 from "../../assets/logo2.png";
import WhatsAppButton from "./WhatsAppButton";
import ScrollToTopButton from "./ScrollToTopButton";
import Swal from "sweetalert2";
import { mockProducts } from "../../data/mockProducts";
import {
  FaWhatsapp,
  FaFacebookF,
  FaPinterestP,
  FaShoppingCart,
  FaHeart,
  FaUser,
  FaSearch,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cart, wishlist } = useApp();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showWishlistDropdown, setShowWishlistDropdown] = useState(false);

  const getDashboardLink = () => {
    if (!user) return "/login";
    if (user.role === "superadmin") return "/superadmin/dashboard";
    if (user.role === "admin") return "/admin/dashboard";
    return "/dashboard";
  };

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalWishlistItems = wishlist.length;

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      {/* Top Bar — desktop only */}
      <div className="bg-[#201064] text-white hidden md:block">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 h-10 flex items-center justify-between min-w-0">
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative group flex items-center">
              <a
                href="https://api.whatsapp.com/send?phone=917749900124&text=Hello%20I%20would%20like%20to%20know%20more%20about%20your%20products%20and%20services."
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with us on WhatsApp"
                className="hover:text-[#25D366] hover:scale-110 active:scale-95 transition-all duration-300 ease-out cursor-pointer flex items-center justify-center"
              >
                <FaWhatsapp />
              </a>
              {/* Tooltip */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1.5 bg-slate-900 text-white text-[10px] font-semibold rounded shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-50">
                Chat with us on WhatsApp
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-x-4 border-x-transparent border-b-4 border-b-slate-900 w-0 h-0" />
              </div>
            </div>
            <FaFacebookF className="hover:text-blue-400 transition cursor-pointer" />
            <FaPinterestP className="hover:text-rose-400 transition cursor-pointer" />
          </div>

          <p className="text-[10px] lg:text-xs font-medium text-center flex-1 px-4 hidden lg:block truncate">
            Cash on Delivery Available for Orders above Rs.500/- and Upto Rs.3000/-
          </p>

          <div className="flex gap-2 text-xs shrink-0">
            <Link to="/" className="hover:underline">Support</Link>
            <span>|</span>
            <Link to="/" className="hover:underline">Careers</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-2 sm:py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo — shrink-0 prevents compression */}
          <Link to="/" className="select-none cursor-pointer flex items-center shrink-0">
            <img
              src={logo2}
              alt="SakRobotix Lab Logo"
              className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto object-contain"
            />
          </Link>

          {/* Desktop Search — hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-xl lg:max-w-2xl mx-3 lg:mx-6">
            <input
              type="text"
              placeholder="Search Products (e.g. Raspberry Pi, Arduino)..."
              className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white transition px-4 py-2.5 rounded-l-xl outline-none text-sm font-medium"
            />
            <button className="bg-[#201064] hover:bg-[#321d96] px-4 lg:px-6 rounded-r-xl text-white transition cursor-pointer shrink-0">
              <FaSearch size={14} />
            </button>
          </div>

          {/* Desktop Action Icons — hidden below md */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6 shrink-0">
            {/* Cart Icon */}
            <Link to="/checkout" className="relative group p-2 cursor-pointer text-slate-700 hover:text-indigo-600 transition">
              <FaShoppingCart size={20} />
              {totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#fb641b] text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm animate-pulse">
                  {totalCartItems}
                </span>
              )}
            </Link>

            {/* Wishlist Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowWishlistDropdown(!showWishlistDropdown);
                  setShowDropdown(false);
                }}
                className="relative p-2 cursor-pointer text-slate-700 hover:text-rose-600 transition focus:outline-none"
              >
                <FaHeart size={19} />
                {totalWishlistItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm">
                    {totalWishlistItems}
                  </span>
                )}
              </button>

              {showWishlistDropdown && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowWishlistDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-slate-100 rounded-xl shadow-xl py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-2 border-b border-slate-50">
                      <p className="text-xs font-bold text-[#201064]">My Wishlist ({totalWishlistItems})</p>
                    </div>
                    <div className="max-h-60 overflow-y-auto no-scrollbar divide-y divide-slate-50">
                      {wishlist.length === 0 ? (
                        <div className="p-4 text-center text-xs text-slate-400 font-bold">
                          Your wishlist is empty.
                        </div>
                      ) : (
                        wishlist.map((id) => {
                          const prod = mockProducts.find((p) => p.id === id);
                          if (!prod) return null;
                          return (
                            <div key={id} className="p-3 flex gap-3 hover:bg-slate-50 transition items-center">
                              <img src={prod.images?.[0] || ""} alt={prod.name} className="w-10 h-10 object-contain bg-white rounded-lg p-0.5 border border-slate-100 shrink-0" />
                              <div className="flex-grow min-w-0">
                                <p className="text-xs font-bold text-slate-800 truncate">{prod.name}</p>
                                <p className="text-[10px] text-indigo-700 font-extrabold">₹{prod.price.toLocaleString("en-IN")}</p>
                              </div>
                              <button
                                onClick={() => {
                                  setShowWishlistDropdown(false);
                                  navigate(`/product/${id}`);
                                }}
                                className="text-[10px] font-black text-white bg-[#201064] hover:bg-[#0A7FE6] px-2.5 py-1.5 rounded-lg transition shrink-0"
                              >
                                View
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* User Auth */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-700 text-xs font-black uppercase shrink-0">
                    {user.name.substring(0, 2)}
                  </div>
                  <span className="text-xs font-bold text-slate-700 hidden lg:inline">{user.name.split(" ")[0]}</span>
                </button>

                {showDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl py-2 z-50 animate-fadeIn">
                      <div className="px-4 py-2 border-b border-slate-50">
                        <p className="text-xs font-bold text-slate-800 truncate">{user.name}</p>
                        <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider mt-0.5">{user.role}</p>
                      </div>
                      <Link
                        to={getDashboardLink()}
                        onClick={() => setShowDropdown(false)}
                        className="block px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                      >
                        My Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          logout();
                          navigate("/");
                        }}
                        className="w-full text-left block px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50/50 transition cursor-pointer"
                      >
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link to="/login" className="p-2 text-slate-700 hover:text-indigo-600 transition cursor-pointer">
                <FaUser size={19} />
              </Link>
            )}
          </div>

          {/* Mobile Right: Cart + Hamburger */}
          <div className="flex md:hidden items-center gap-1">
            <Link to="/checkout" className="relative p-2 text-slate-700">
              <FaShoppingCart size={19} />
              {totalCartItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#fb641b] text-white w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold">
                  {totalCartItems}
                </span>
              )}
            </Link>
            <button
              className="p-2 text-[#201064] hover:bg-slate-100 rounded-lg transition"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Search — always visible on mobile, below header row */}
        <div className="flex md:hidden mt-2.5">
          <input
            type="text"
            placeholder="Search Products..."
            className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white transition px-4 py-2 rounded-l-xl outline-none text-sm font-medium"
          />
          <button className="bg-[#201064] px-4 rounded-r-xl text-white transition cursor-pointer shrink-0">
            <FaSearch size={13} />
          </button>
        </div>

        {/* Desktop Navigation Bar */}
        <div className="hidden lg:flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
          <button
            onClick={() => navigate("/categories")}
            className="bg-[#201064] hover:bg-[#321d96] text-white px-5 py-2.5 rounded-lg font-bold text-sm transition cursor-pointer shadow-sm shrink-0"
          >
            Shop By Category
          </button>

          <nav className="flex items-center gap-4 xl:gap-6 text-sm font-bold text-slate-600 flex-wrap">
            <Link to="/" className="hover:text-[#201064] transition whitespace-nowrap">Shop By Brand</Link>
            <Link to="/" className="hover:text-[#201064] transition whitespace-nowrap">Bulk Orders</Link>
            <Link to="/" className="hover:text-[#201064] transition whitespace-nowrap">Lab Setup</Link>
            <span className="bg-indigo-50 text-[#201064] px-3 py-1.5 rounded-lg text-xs font-extrabold tracking-wider border border-indigo-100 select-none uppercase whitespace-nowrap">
              STEMATHON 2026
            </span>
            <Link to="/gallery" className="hover:text-[#201064] transition whitespace-nowrap">Product Gallery</Link>
            <Link to="/" className="hover:text-[#201064] transition text-rose-600 whitespace-nowrap">Top Deals</Link>
          </nav>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-slate-900/20 z-30 md:hidden"
              onClick={() => setIsOpen(false)}
            />
            <div className="relative z-40 lg:hidden mt-3 bg-white rounded-xl shadow-xl border border-slate-100 animate-slideDown overflow-hidden">
              <div className="flex flex-col p-4 gap-1">
                <button
                  onClick={() => { setIsOpen(false); navigate("/categories"); }}
                  className="bg-[#201064] text-white py-3 rounded-lg font-bold text-center transition cursor-pointer text-sm"
                >
                  Shop By Category
                </button>

                {[
                  { to: "/", label: "Shop By Brand" },
                  { to: "/", label: "Bulk Orders" },
                  { to: "/", label: "Lab Setup" },
                  { to: "/gallery", label: "Product Gallery" },
                ].map(({ to, label }) => (
                  <Link
                    key={label}
                    to={to}
                    onClick={() => setIsOpen(false)}
                    className="hover:text-[#201064] py-2.5 border-b border-slate-50 transition text-sm font-semibold text-slate-700 px-1"
                  >
                    {label}
                  </Link>
                ))}
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className="text-indigo-600 font-bold py-2.5 border-b border-slate-50 text-sm px-1"
                >
                  STEMATHON 2026
                </Link>
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className="text-rose-600 font-semibold py-2.5 border-b border-slate-50 text-sm px-1"
                >
                  Top Deals
                </Link>

                {/* Auth section */}
                <div className="mt-2 pt-3 border-t border-slate-100">
                  {isAuthenticated && user ? (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl">
                        <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-700 text-xs font-black uppercase shrink-0">
                          {user.name.substring(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate">{user.name}</p>
                          <p className="text-[9px] text-indigo-600 font-bold uppercase">{user.role}</p>
                        </div>
                      </div>
                      <Link
                        to={getDashboardLink()}
                        onClick={() => setIsOpen(false)}
                        className="text-center bg-indigo-50 text-[#201064] font-bold text-xs py-2.5 rounded-xl hover:bg-indigo-100 transition"
                      >
                        Go to Dashboard
                      </Link>
                      <button
                        onClick={() => { setIsOpen(false); logout(); navigate("/"); }}
                        className="text-center text-rose-600 font-bold text-xs py-2.5 bg-rose-50 rounded-xl hover:bg-rose-100 transition cursor-pointer"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Link
                        to="/login"
                        onClick={() => setIsOpen(false)}
                        className="flex-1 text-center bg-[#201064] text-white font-bold text-xs py-2.5 rounded-xl hover:bg-[#321d96] transition"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setIsOpen(false)}
                        className="flex-1 text-center border border-[#201064] text-[#201064] font-bold text-xs py-2.5 rounded-xl hover:bg-indigo-50 transition"
                      >
                        Register
                      </Link>
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          const count = wishlist.length;
                          Swal.fire({
                            title: "My Wishlist",
                            text: count === 0
                              ? "Your wishlist is currently empty."
                              : `You have ${count} items saved in your wishlist.`,
                            icon: "info",
                            confirmButtonText: "OK",
                            confirmButtonColor: "#201064"
                          });
                        }}
                        className="relative p-2.5 text-slate-700"
                      >
                        <FaHeart size={18} />
                        {totalWishlistItems > 0 && (
                          <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center">
                            {totalWishlistItems}
                          </span>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Floating Buttons */}
      <WhatsAppButton />
      <ScrollToTopButton />
    </header>
  );
};

export default Navbar;