import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaTwitter,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import logo2 from "../../assets/logo2.png";

const Footer: React.FC = () => {

  return (
    <footer className="relative bg-[#201064] text-white overflow-hidden border-t border-white/5">
      {/* Circuit board pattern background overlay */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none overflow-hidden select-none">
        {/* Top right circuit trace */}
        <svg className="absolute top-0 right-0 h-[350px] w-[350px] text-white" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
          <path d="M100 20 H70 L50 40 H20 L10 50 H0" />
          <path d="M70 20 L60 10 H30" />
          <path d="M50 40 L40 30 H10" />
          <path d="M20 40 L15 35 H0" />
          <circle cx="70" cy="20" r="1.2" fill="currentColor" />
          <circle cx="50" cy="40" r="1.2" fill="currentColor" />
          <circle cx="20" cy="40" r="1.2" fill="currentColor" />
          <circle cx="60" cy="10" r="1.2" fill="currentColor" />
          <circle cx="40" cy="30" r="1.2" fill="currentColor" />
        </svg>
        
        {/* Bottom left circuit trace */}
        <svg className="absolute bottom-0 left-0 h-[280px] w-[280px] text-white" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
          <path d="M0 80 H30 L50 60 H80 L90 50 H100" />
          <path d="M30 80 L40 90 H70" />
          <path d="M50 60 L60 70 H90" />
          <circle cx="30" cy="80" r="1.2" fill="currentColor" />
          <circle cx="50" cy="60" r="1.2" fill="currentColor" />
          <circle cx="80" cy="60" r="1.2" fill="currentColor" />
          <circle cx="40" cy="90" r="1.2" fill="currentColor" />
          <circle cx="60" cy="70" r="1.2" fill="currentColor" />
        </svg>

        {/* Tech Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      {/* Newsletter Subscription Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 relative z-10">
        <div className="relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 p-8 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-2xl backdrop-blur-md">
          {/* Subtle gradient glow effects inside the card */}
          <div className="absolute -left-20 -top-20 w-48 h-48 rounded-full bg-[#0A82EB]/20 filter blur-3xl" />
          <div className="absolute -right-20 -bottom-20 w-48 h-48 rounded-full bg-indigo-500/20 filter blur-3xl" />
          
          <div className="relative z-10 space-y-2">
            <span className="text-[#0A82EB] text-xs font-bold uppercase tracking-widest">
              Stay Connected
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-slate-300 text-sm max-w-xl font-medium">
              Join our community of innovators. Get updates on robotics competitions, school labs, new DIY kits, and tech articles.
            </p>
          </div>

          <div className="relative z-10 flex w-full lg:w-auto flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full lg:w-72 xl:w-[320px] px-5 py-4 rounded-xl bg-white/15 border border-white/10 text-white placeholder-slate-400 text-sm outline-none focus:border-[#0A82EB] focus:bg-white/20 transition-all duration-300"
              required
            />
            <button
              aria-label="Subscribe"
              className="bg-[#0A82EB] hover:bg-[#0066cc] text-white font-bold px-7 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-[#0A82EB]/20 flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider text-xs whitespace-nowrap"
            >
              <span>Subscribe</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-8">
          
          {/* Logo & Company Description Column */}
          <div className="sm:col-span-2 lg:col-span-2 space-y-5 min-w-0">
            <Link to="/" className="inline-block bg-white/95 p-2 rounded-xl transition-all duration-300 hover:bg-white shadow-md">
              <img src={logo2} alt="Sak Robotix Lab Logo" className="h-10 sm:h-12 w-auto object-contain" />
            </Link>
            
            <div className="space-y-2">
              <span className="text-[#0A82EB] text-xs font-bold uppercase tracking-[3px] block">
                One Home – One Robot
              </span>
              <p className="text-slate-300 text-sm leading-relaxed font-medium">
                Sak Robotix Lab Pvt. Ltd. is dedicated to transforming education and innovation through Robotics, Artificial Intelligence, IoT, Embedded Systems, and emerging technologies. We empower students, institutions, and organizations with future-ready skills and cutting-edge solutions.
              </p>
            </div>

            {/* Social Media Circular Icons */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Follow Our Journey</h4>
              <div className="flex gap-3">
                {[
                  { Icon: FaFacebookF, href: "#", name: "Facebook" },
                  { Icon: FaLinkedinIn, href: "#", name: "LinkedIn" },
                  { Icon: FaTwitter, href: "#", name: "Twitter/X" },
                  { Icon: FaYoutube, href: "#", name: "YouTube" },
                  { Icon: FaInstagram, href: "#", name: "Instagram" }
                ].map(({ Icon, href, name }) => (
                  <a
                    key={name}
                    href={href}
                    aria-label={name}
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-[#0A82EB] hover:border-[#0A82EB] text-white hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center text-sm shadow-md"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Company Column */}
          <div className="space-y-4">
            <h3 className="text-white text-base font-extrabold border-b-2 border-[#0A82EB] pb-2 w-fit">
              Company
            </h3>
            <ul className="space-y-2.5">
              {[
                "About Us",
                "Our Story",
                "Clients",
                "Why Choose Us",
                "Business Partners",
                "Innovation Hub",
                "Our Team",
                "Careers",
                "Contact Us"
              ].map((linkName) => (
                <li key={linkName}>
                  <Link
                    to="/"
                    className="hover:text-[#0A82EB] hover:translate-x-1.5 transition-all duration-200 block text-slate-300 text-sm font-semibold"
                  >
                    {linkName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Labs & Training Column */}
          <div className="space-y-4">
            <h3 className="text-white text-base font-extrabold border-b-2 border-[#0A82EB] pb-2 w-fit">
              Labs & Training
            </h3>
            <ul className="space-y-2.5">
              {[
                "School Robotics Innovation Lab",
                "Center of Excellence in Robotics",
                "Center of Excellence in AI/ML",
                "Center of Excellence in IoT",
                "Center of Excellence in Embedded Systems",
                "Center of Excellence in Additive Manufacturing"
              ].map((linkName) => (
                <li key={linkName}>
                  <Link
                    to="/"
                    className="hover:text-[#0A82EB] hover:translate-x-1.5 transition-all duration-200 block text-slate-300 text-sm font-semibold"
                  >
                    {linkName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products & Solutions Column */}
          <div className="space-y-4">
            <h3 className="text-white text-base font-extrabold border-b-2 border-[#0A82EB] pb-2 w-fit">
              Products & Solutions
            </h3>
            <ul className="space-y-2.5">
              {[
                "DIY Robotics Kits",
                "Educational Robots",
                "AI Learning Kits",
                "Smart IoT Devices",
                "Drone Training Kits",
                "Embedded Development Boards"
              ].map((linkName) => (
                <li key={linkName}>
                  <Link
                    to="/"
                    className="hover:text-[#0A82EB] hover:translate-x-1.5 transition-all duration-200 block text-slate-300 text-sm font-semibold"
                  >
                    {linkName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Legal Column */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-white text-base font-extrabold border-b-2 border-[#0A82EB] pb-2 w-fit">
                Contact Info
              </h3>
              <div className="space-y-3.5 text-slate-300 text-sm font-semibold">
                <div className="flex gap-3 items-start">
                  <FaMapMarkerAlt className="mt-1 text-[#0A82EB] shrink-0" size={14} />
                  <span className="leading-relaxed">
                    CTEF-INNOVEX, CIPET-IPT, Patia, Bhubaneswar, Odisha – 751013
                  </span>
                </div>
                <div className="flex gap-3 items-center">
                  <FaPhoneAlt className="text-[#0A82EB] shrink-0" size={13} />
                  <a href="tel:+918114347999" className="hover:text-[#0A82EB] transition-colors duration-200">
                    +91 81143 47999
                  </a>
                </div>
                <div className="flex gap-3 items-center">
                  <FaEnvelope className="text-[#0A82EB] shrink-0" size={13} />
                  <a href="mailto:info@sakrobotix.com" className="hover:text-[#0A82EB] transition-colors duration-200">
                    info@sakrobotix.com
                  </a>
                </div>
              </div>
            </div>

            {/* Legal Links nested inside this column */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Legal & Support</h4>
              <ul className="space-y-2">
                {[
                  "Terms & Conditions",
                  "Privacy Policy",
                  "Disclaimer",
                  "Shipping Policy",
                  "Refund & Return Policy"
                ].map((linkName) => (
                  <li key={linkName}>
                    <Link
                      to="/"
                      className="hover:text-[#0A82EB] hover:translate-x-1.5 transition-all duration-200 block text-slate-300 text-xs font-bold"
                    >
                      {linkName}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Legal Copyright Bar */}
      <div className="border-t border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs font-semibold text-slate-400 text-center">
          <p className="order-2 sm:order-1">© 2025 Sak Robotix Lab Pvt. Ltd. All Rights Reserved.</p>
          <div className="flex flex-wrap justify-center gap-4 order-1 sm:order-2">
            <Link to="/" className="hover:text-[#0A82EB] transition-colors">Terms of Service</Link>
            <Link to="/" className="hover:text-[#0A82EB] transition-colors">Privacy Policy</Link>
            <Link to="/" className="hover:text-[#0A82EB] transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>

</footer>
  );
};

export default Footer;
