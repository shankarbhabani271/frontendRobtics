import React from "react";

// Import logo images from assets
import logo11 from "../../assets/logo11.jpg";
import logo12 from "../../assets/logo12.png";
import logo13 from "../../assets/logo13.png";
import logo14 from "../../assets/logo14.png";
import logo15 from "../../assets/logo15.png";
import logo16 from "../../assets/logo16.png";
import logo17 from "../../assets/logo17.png";
import logo18 from "../../assets/logo18.png";
import logo19 from "../../assets/logo19.png";

interface PartnerLogo {
  name: string;
  image: string;
  colorClass: string; // Standardized hover styling
}

// All logos use the same premium hover theme: soft indigo bg and border
const hoverThemeClass = "hover:bg-indigo-50/50 hover:border-indigo-200";

const track1Logos: PartnerLogo[] = [
  { name: "Partner 11", image: logo11, colorClass: hoverThemeClass },
  { name: "Partner 12", image: logo12, colorClass: hoverThemeClass },
  { name: "Partner 13", image: logo13, colorClass: hoverThemeClass },
  { name: "Partner 14", image: logo14, colorClass: hoverThemeClass },
  { name: "Partner 15", image: logo15, colorClass: hoverThemeClass },
];

const track2Logos: PartnerLogo[] = [
  { name: "Partner 16", image: logo16, colorClass: hoverThemeClass },
  { name: "Partner 17", image: logo17, colorClass: hoverThemeClass },
  { name: "Partner 18", image: logo18, colorClass: hoverThemeClass },
  { name: "Partner 19", image: logo19, colorClass: hoverThemeClass },
];

// Duplicate logos to create a seamless infinite scrolling loop
const track1Extended = [...track1Logos, ...track1Logos, ...track1Logos, ...track1Logos];
const track2Extended = [...track2Logos, ...track2Logos, ...track2Logos, ...track2Logos, ...track2Logos];

const TrustedOrganizations: React.FC = () => {
  return (
    <section id="trusted-by" className="py-24 bg-slate-50 border-t border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase font-extrabold text-[#201064]/80 tracking-[4px] block mb-3">
            COLLABORATIONS
          </span>
          <h3 className="text-indigo-600 font-extrabold text-sm md:text-base mb-2 uppercase tracking-wider">
            Partnering with 100+ Schools, Colleges & Industry Leaders
          </h3>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#201064] tracking-tight mt-1">
            Trusted By Leading Organizations
          </h2>
          <p className="mt-4 text-slate-500 text-sm md:text-base max-w-2xl mx-auto font-medium leading-relaxed">
            We are proud to collaborate with educational institutions, government organizations, startups, and industry leaders across India.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#201064] to-indigo-600 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Scrolling Marquees Wrapper */}
        <div className="marquee-container flex flex-col gap-6 relative max-w-[1400px] mx-auto select-none">
          {/* Fading Side Overlays for Premium Look */}
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-slate-55 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-slate-55 to-transparent z-10 pointer-events-none" />

          {/* Row 1: Left to Right Marquee */}
          <div className="overflow-hidden w-full flex py-2">
            <div className="animate-marquee-right flex gap-6">
              {track1Extended.map((logo, index) => (
                <div 
                  key={`track1-${index}`}
                  className="w-[180px] sm:w-[220px] md:w-[250px] shrink-0 px-3"
                >
                  <div className={`bg-white border border-slate-100/80 rounded-2xl p-5 flex items-center justify-center h-24 ${logo.colorClass} hover:scale-105 hover:shadow-lg transition-all duration-300 ease-out cursor-pointer group`}>
                    <img 
                      src={logo.image} 
                      alt={logo.name} 
                      className="max-h-14 max-w-full object-contain transition-all duration-300"
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2: Right to Left Marquee */}
          <div className="overflow-hidden w-full flex py-2">
            <div className="animate-marquee-left flex gap-6">
              {track2Extended.map((logo, index) => (
                <div 
                  key={`track2-${index}`}
                  className="w-[180px] sm:w-[220px] md:w-[250px] shrink-0 px-3"
                >
                  <div className={`bg-white border border-slate-100/80 rounded-2xl p-5 flex items-center justify-center h-24 ${logo.colorClass} hover:scale-105 hover:shadow-lg transition-all duration-300 ease-out cursor-pointer group`}>
                    <img 
                      src={logo.image} 
                      alt={logo.name} 
                      className="max-h-14 max-w-full object-contain transition-all duration-300"
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default TrustedOrganizations;
