import { useState, useEffect } from "react";
import { Cpu, Code, Cloud, Plane, Phone, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import bannerImg from "../../assets/wilyfox-127.avif";
import bannerMain from "../../assets/wilyfox-124.avif";
import bannerWide from "../../assets/wilyfox-125.webp";
import bannerDIY from "../../assets/wilyfox126.avif";
import bannerAudio from "../../assets/wilyfox-127.avif";
import heroImg from "../../assets/image3.png";

const HeroSlider = () => {
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsCallModalOpen(false);
      }
    };
    if (isCallModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCallModalOpen]);

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <section className="relative w-full overflow-hidden bg-white">
      {/* Light Grid-Themed Robotics Camp Hero Section */}
      <div className="relative w-full bg-white text-slate-800 py-10 sm:py-16 lg:py-24 border-b border-slate-100 flex items-center min-h-[420px] sm:min-h-[500px]">
        {/* Crisp background grid pattern overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        {/* Floating Phone Call widget — hidden on small screens to prevent hero overlap */}
        <div 
          onClick={() => setIsCallModalOpen(true)}
          className="hidden sm:flex absolute top-4 right-4 lg:top-8 lg:right-10 items-center space-x-2.5 bg-[#1a0e53] text-white p-2.5 px-4 rounded-full shadow-lg z-20 cursor-pointer hover:bg-[#0A7FE6] transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.97] max-w-[220px] sm:max-w-xs"
        >
          <div className="w-7 h-7 rounded-full bg-white text-[#1a0e53] flex items-center justify-center shadow-inner shrink-0">
            <Phone size={13} className="fill-[#1a0e53] stroke-[2.5]" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] text-indigo-200 font-bold uppercase tracking-wider leading-none">Call for Summer Camp</p>
            <p className="text-xs sm:text-sm font-extrabold mt-0.5 leading-none truncate">+91 77499-00124</p>
          </div>
        </div>

        {/* Content Container */}
        <div className="relative max-w-7xl xl:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-6 flex flex-col justify-center space-y-5 sm:space-y-6">
              
              {/* Badge */}
              <div className="inline-flex items-center bg-[#1a0e53] text-white px-4 py-2.5 rounded-full w-fit shadow-md">
                <span className="text-[10px] font-extrabold uppercase tracking-widest leading-none">
                  Make your child future ready (Age-7-17 Years)
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1a0e53] leading-tight">
                Build the Future <br />
                with Robotics
              </h1>

              {/* Description */}
              <p className="text-slate-600 text-sm sm:text-base lg:text-lg max-w-xl leading-relaxed font-medium">
                Explore Robotics, Coding, and IoT through hands-on projects and real-world challenges. Inspire creativity, innovation, and problem-solving skills in your child.
              </p>

              {/* CTA Action button */}
              <div>
                <a
                  href="#featured-products"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("featured-products")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex items-center justify-center bg-[#1a0e53] hover:bg-[#251475] text-white font-bold px-8 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer text-sm"
                >
                  Learn More
                </a>
              </div>

            </div>

            {/* Right Image Column */}
            <div className="md:col-span-1 lg:col-span-6 flex justify-center items-center relative w-full">
              <img
                src={heroImg}
                alt="Robotics Mockup Design"
                className="w-full max-w-xs sm:max-w-sm md:max-w-[480px] lg:max-w-[580px] h-auto object-contain rounded-3xl shadow-xl hover:scale-[1.02] transition duration-500 border border-slate-100"
              />
            </div>

          </div>

          {/* Bottom Grid Cards - Robotics, Coding, IoT, Drone Tech */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 mt-10 sm:mt-14 pt-6 sm:pt-8 border-t border-slate-200/60">
            
            {/* Robotics */}
            <div className="bg-[#1a0e53] border border-[#251475] text-white p-5 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white">
                <Cpu size={24} className="stroke-[2]" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold uppercase tracking-wider">Robotics</h4>
                <p className="text-xs text-indigo-200 mt-1 font-medium">Design, Build & Program Robots</p>
              </div>
            </div>

            {/* Coding */}
            <div className="bg-[#1a0e53] border border-[#251475] text-white p-5 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white">
                <Code size={24} className="stroke-[2]" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold uppercase tracking-wider">Coding</h4>
                <p className="text-xs text-indigo-200 mt-1 font-medium">Learn Programming Through Fun Projects</p>
              </div>
            </div>

            {/* IoT */}
            <div className="bg-[#1a0e53] border border-[#251475] text-white p-5 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white">
                <Cloud size={24} className="stroke-[2]" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold uppercase tracking-wider">IOT</h4>
                <p className="text-xs text-indigo-200 mt-1 font-medium">Connect Devices, Automate & Innovate</p>
              </div>
            </div>

            {/* Drone Tech */}
            <div className="bg-[#1a0e53] border border-[#251475] text-white p-5 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white">
                <Plane size={24} className="stroke-[2]" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold uppercase tracking-wider">Drone Tech</h4>
                <p className="text-xs text-indigo-200 mt-1 font-medium">Explore Drones and Aerial Robotics</p>
              </div>
            </div>

          </div>

        </div>
      </div>
 
  {/* Large Banner */}
   <section className="w-full py-6 sm:py-8 lg:py-12 bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50">
      <div className="max-w-7xl xl:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">

          {/* Left Large Banner */}
          <div className="lg:col-span-1 lg:row-span-2 relative overflow-hidden rounded-2xl sm:rounded-3xl h-[380px] sm:h-[480px] lg:h-[620px] shadow-xl group">

            <img
              src={bannerMain}
              alt="SakRobotix Innovation"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#001D3D]/90 via-[#00509D]/30 to-transparent"></div>

            <div className="relative z-10 flex flex-col justify-end h-full p-6 sm:p-8 lg:p-10 text-white">

              <span className="text-xs sm:text-sm uppercase tracking-[4px] font-semibold text-cyan-300">
                SAKROBOTIX
              </span>

              <h2 className="mt-2 font-bold leading-tight text-3xl sm:text-4xl lg:text-5xl">
                Innovation <br />
                Hub
              </h2>

              <p className="mt-3 font-semibold text-lg sm:text-xl">
                Smart Tech Collection
              </p>

              <p className="mt-3 text-sm sm:text-base text-slate-200 max-w-sm">
                Robotics, IoT, AI Modules, Electronics & DIY Kits.
              </p>

              <button className="mt-6 bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold w-fit hover:bg-cyan-400 hover:text-white transition-all duration-300">
                Explore Products
              </button>

            </div>
          </div>

          {/* Top Right Banner */}
          <div className="lg:col-span-2 relative overflow-hidden rounded-2xl sm:rounded-3xl h-[220px] sm:h-[270px] lg:h-[300px] shadow-xl group">

            <img
              src={bannerWide}
              alt="Electronics"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-[#240046]/90 via-[#3C096C]/40 to-transparent"></div>

            <div className="relative z-10 flex flex-col justify-center h-full p-6 sm:p-8 lg:p-10 text-white">

              <span className="text-xs sm:text-sm uppercase tracking-[4px] font-semibold text-cyan-300">
                ELECTRONICS STORE
              </span>

              <h2 className="mt-3 font-bold text-2xl sm:text-4xl lg:text-5xl">
                Future Ready Electronics
              </h2>

              <p className="mt-3 text-sm sm:text-lg text-slate-200 max-w-xl">
                Explore cutting-edge development boards, sensors, AI gadgets
                and next-generation hardware.
              </p>

              <button className="mt-5 bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold w-fit hover:bg-cyan-400 hover:text-white transition-all duration-300">
                Shop Now
              </button>

            </div>
          </div>

          {/* DIY Projects */}
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl h-[220px] sm:h-[260px] lg:h-[300px] shadow-xl group">

            <img
              src={bannerDIY}
              alt="DIY Projects"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#FF6B00]/80 via-[#FFB703]/20 to-transparent"></div>

            <div className="relative z-10 flex flex-col justify-end h-full p-6 sm:p-8 text-white">

              <span className="text-xs sm:text-sm uppercase tracking-[4px] font-semibold">
                MAKER ZONE
              </span>

              <h3 className="mt-2 font-bold text-2xl sm:text-3xl lg:text-4xl">
                DIY Projects
              </h3>

              <p className="mt-3 text-sm sm:text-base text-white/90">
                Create amazing inventions with premium maker kits.
              </p>

              <button className="mt-5 bg-white text-orange-600 px-5 py-3 rounded-xl font-semibold w-fit hover:bg-orange-500 hover:text-white transition-all duration-300">
                Learn More
              </button>

            </div>
          </div>

          {/* Smart Gadgets */}
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl h-[220px] sm:h-[260px] lg:h-[300px] shadow-xl group">

            <img
              src={bannerAudio}
              alt="Smart Gadgets"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#7209B7]/90 via-[#B5179E]/30 to-transparent"></div>

            <div className="relative z-10 flex flex-col justify-end h-full p-6 sm:p-8 text-white">

              <span className="text-xs sm:text-sm uppercase tracking-[4px] font-semibold text-cyan-200">
                TRENDING TECH
              </span>

              <h3 className="mt-2 font-bold text-2xl sm:text-3xl lg:text-4xl">
                Smart Gadgets
              </h3>

              <p className="mt-3 text-sm sm:text-base text-white/90">
                Discover innovative accessories and next-generation devices.
              </p>

              <button className="mt-5 bg-white text-purple-700 px-5 py-3 rounded-xl font-semibold w-fit hover:bg-purple-500 hover:text-white transition-all duration-300">
                Shop Now
              </button>

            </div>
          </div>

        </div>

      </div>
    </section>    {/*new line for */}
    <section className="w-full py-6 sm:py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="border border-slate-200 rounded-xl overflow-hidden bg-gradient-to-r from-white via-slate-50 to-white shadow-sm hover:shadow-lg transition-all duration-300">

          <div className="grid grid-cols-1 sm:grid-cols-12 items-center min-h-[140px]">

            {/* Left Content */}
            <div className="sm:col-span-5 p-5 sm:p-6 md:p-8">

              <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 rounded-full mb-3">
                SakRobotix Exclusive
              </span>

              <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-slate-900 leading-tight">
                Save up to 40% on Smart Electronics &amp; DIY Kits
              </h2>

              <p className="mt-2 text-slate-600 text-sm">
                Limited-time deals on robotics, IoT modules, sensors, development boards and maker tools.
              </p>

            </div>

            {/* Center Product Image */}
            <div className="sm:col-span-3 flex justify-center items-center py-3 sm:py-4">

              <img
                src={bannerImg}
                alt="SakRobotix Product"
                className="h-20 sm:h-24 md:h-32 lg:h-36 w-auto object-contain hover:scale-105 transition duration-300"
              />

            </div>

            {/* Logo Badge */}
            <div className="hidden sm:flex sm:col-span-2 justify-center items-center py-4">

              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">

                <span className="text-white font-bold text-lg sm:text-xl">
                  SR
                </span>

              </div>

            </div>

            {/* CTA */}
            <div className="sm:col-span-2 flex justify-center sm:justify-end items-center p-4 sm:p-6">

              <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-xl text-sm">
                Shop Now
              </button>

            </div>

          </div>

        </div>

      </div>
    </section>
    

      <AnimatePresence>
        {isCallModalOpen && (
          <div 
            role="dialog"
            aria-modal="true"
            aria-labelledby="call-modal-title"
            aria-describedby="call-modal-message"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={backdropVariants}
              transition={{ duration: 0.2 }}
              onClick={() => setIsCallModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={modalVariants}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative z-10 border border-slate-100"
            >
              {/* Close Button X */}
              <button
                type="button"
                onClick={() => setIsCallModalOpen(false)}
                aria-label="Close modal"
                className="absolute top-4 right-4 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 rounded-full p-2 transition-all duration-200 cursor-pointer outline-none"
              >
                <X size={16} />
              </button>

              {/* Modal Body */}
              <div className="p-6 md:p-8 space-y-6">
                
                {/* Header Icon & Title */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 text-[#201064] flex items-center justify-center shadow-sm">
                    <Phone size={18} className="fill-[#201064] stroke-[#201064] stroke-1" />
                  </div>
                  <h3 id="call-modal-title" className="text-lg font-black text-[#201064] flex items-center gap-1.5">
                    📞 Contact SAKROBOTIX
                  </h3>
                </div>

                {/* Message */}
                <div className="space-y-3">
                  <p id="call-modal-message" className="text-slate-600 text-sm font-semibold">
                    Are you sure you want to call our support team?
                  </p>
                  
                  {/* Big clear phone number */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                    <a 
                      href="tel:+917749900124"
                      className="text-2xl font-black text-[#201064] hover:text-[#0A7FE6] transition-colors duration-200 tracking-wide inline-block"
                    >
                      +91 77499 00124
                    </a>
                  </div>
                </div>

                {/* Assist List */}
                <div className="space-y-2.5">
                  <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                    Our team is available to assist you with:
                  </p>
                  <ul className="grid grid-cols-2 gap-2 text-[11px] font-bold text-slate-600">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0A7FE6]" />
                      Course Enrollment
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0A7FE6]" />
                      Robotics Training
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0A7FE6]" />
                      Summer Camps
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0A7FE6]" />
                      Product Information
                    </li>
                  </ul>
                </div>

                {/* Business Hours */}
                <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100/30 space-y-1">
                  <p className="text-[9px] font-extrabold uppercase text-[#0A7FE6] tracking-wider">
                    Business Hours
                  </p>
                  <div className="flex justify-between text-[11px] font-black text-[#201064]">
                    <span>Monday - Saturday</span>
                    <span>09:00 AM – 07:00 PM</span>
                  </div>
                </div>

              </div>

              {/* Modal Actions */}
              <div className="bg-slate-50 px-6 py-5 border-t border-slate-100 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsCallModalOpen(false)}
                  className="flex-1 px-5 py-3 border border-[#201064] text-[#201064] hover:bg-[#201064]/5 transition-colors duration-300 font-extrabold text-xs rounded-xl cursor-pointer uppercase tracking-wider"
                >
                  Cancel
                </button>
                <a
                  href="tel:+917749900124"
                  onClick={() => setIsCallModalOpen(false)}
                  className="flex-1 bg-[#201064] hover:bg-[#0A7FE6] text-white py-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer uppercase tracking-wider text-center"
                >
                  Call Now
                </a>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default HeroSlider;