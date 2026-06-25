import React, { useState } from "react";
import { Calendar, ArrowRight, X, Sparkles, Award, Globe, Heart, ShieldAlert } from "lucide-react";

// Image imports (using relative paths as alias @/ is not configured)
import wilyfoxbhabani1 from "../../assets/wilyfoxbhabani1.avif";
import wilyfoxbhabani2 from "../../assets/wilyfoxbhabani2.avif";
import wilyfoxbhabani3 from "../../assets/wilyfoxbhabani3.avif";
import wilyfoxbhabani4 from "../../assets/wilyfoxbhabani4.png";
import wilyfoxbhabani6 from "../../assets/wilyfox126.avif"; // Using wilyfox126.avif as substitute for wilyfoxbhabani6

interface NewsItem {
  id: string;
  image: string;
  date: string;
  category: string;
  title: string;
  shortDescription: string;
  fullContent: string;
  icon: React.ReactNode;
}

const newsItems: NewsItem[] = [
  {
    id: "1",
    image: wilyfoxbhabani1,
    date: "Jun 15, 2026",
    category: "Hardware Innovation",
    title: "SakRobotix Bhabani v1: Empowering Next-Gen Robotics Makers",
    shortDescription: "We are thrilled to launch the SakRobotix Bhabani development board. Designed with built-in protection circuits, advanced motor drivers, and seamless ESP32 integration.",
    fullContent: "The SakRobotix Bhabani v1 development board marks a significant milestone in educational robotics hardware. Built specifically to handle the rigors of classroom learning and high-stakes competitions, it features robust short-circuit protection, reverse-polarity protection, and on-board dual motor drivers. By reducing the complexity of wiring and the risk of component damage, the board allows students to focus entirely on logical design and programming. The board also features plug-and-play ports for popular sensors, high-current output lines for heavy-duty servos, and is fully compatible with ESP32 and Arduino IDE environments.",
    icon: <Sparkles size={16} className="text-amber-500" />
  },
  {
    id: "2",
    image: wilyfoxbhabani2,
    date: "Jun 10, 2026",
    category: "Championship",
    title: "Victory at National Robotics Championship 2026",
    shortDescription: "Students powered by SakRobotix Bhabani development boards secured the 1st and 2nd runners-up titles in the autonomous maze-solving category.",
    fullContent: "At the National Robotics Championship 2026 held in Bengaluru, teams using the SakRobotix Bhabani controller boards dominated the arena. Facing tough competition from over 150 teams nationwide, the SakRobotix-powered robots demonstrated incredible stability and responsiveness. The onboard protection system prevented critical controller resets when motors stalled, giving our teams a decisive edge in reliability. The students credit the pre-routed, noise-isolated sensor traces on the Bhabani board for their high-speed sensor readings that made precise navigation possible.",
    icon: <Award size={16} className="text-amber-500" />
  },
  {
    id: "3",
    image: wilyfoxbhabani3,
    date: "Jun 02, 2026",
    category: "Collaboration",
    title: "Strategic Partnership with IIT Madras Incubator",
    shortDescription: "We have partnered with the IIT Madras Robotics Lab to deploy low-cost, high-reliability robotics training kits across rural schools.",
    fullContent: "SakRobotix has officially signed a Memorandum of Understanding (MoU) with the IIT Madras Robotics Lab to drive STEM literacy in rural India. Under this partnership, SakRobotix will supply custom-designed educational robot kits powered by the Bhabani motherboard. The initiative aims to bridge the digital divide by training over 10,000 students in basic coding, sensors, and mechanical assembly. In addition to hardware, our engineers are co-developing a vernacular digital curriculum that will be distributed for free to regional government schools.",
    icon: <Globe size={16} className="text-blue-500" />
  },
  {
    id: "4",
    image: wilyfoxbhabani4,
    date: "May 25, 2026",
    category: "Agritech Innovation",
    title: "Precision Drone Telemetry for Smart Agriculture",
    shortDescription: "Introducing the SakRobotix Agritech controller module. Supporting real-time multi-sensor telemetry and autonomous GPS waypoint guidance.",
    fullContent: "SakRobotix is entering the agricultural tech sphere with the release of our modular drone flight-telemetry shield. Designed as an add-on for the Bhabani and STM32 ecosystems, the module integrates multi-spectral cameras, GPS, and long-range LoRa radios. This allows small-scale farmers and agronomists to gather vital crop health data, soil moisture mappings, and autonomous spraying flight-paths. The unit is optimized for power efficiency and has been field-tested in harsh weather conditions to ensure continuous data streams.",
    icon: <ShieldAlert size={16} className="text-emerald-500" />
  },
  {
    id: "5",
    image: wilyfoxbhabani6,
    date: "May 18, 2026",
    category: "Community Impact",
    title: "Expanding Community Makerspaces Worldwide",
    shortDescription: "To foster a thriving ecosystem of creators, SakRobotix has opened 3 new community-supported workshops with free access to 3D printers.",
    fullContent: "Our commitment to open innovation reaches new heights with the expansion of SakRobotix Makerspaces. Located in tier-2 cities, these spaces are designed to provide young inventors, hobbyists, and educators with free access to industrial-grade tools. Each makerspace is equipped with high-precision 3D printers, CNC routers, soldering stations, and a complete catalog of SakRobotix controller boards. Weekly workshops covering Python programming, PCB layout design, and mechanical modeling will be led by industry professionals.",
    icon: <Heart size={16} className="text-rose-500" />
  }
];

const LatestNewsEvents: React.FC = () => {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  const openModal = (news: NewsItem) => {
    setSelectedNews(news);
    document.body.style.overflow = "hidden"; // Disable background scrolling
  };

  const closeModal = () => {
    setSelectedNews(null);
    document.body.style.overflow = "unset"; // Restore background scrolling
  };

  return (
    <section id="latest-news" className="py-20 bg-slate-50 border-t border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center mb-16 relative">
          <div className="inline-flex items-center space-x-1.5 bg-[#201064]/5 border border-[#201064]/10 px-3 py-1 rounded-full mb-3 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-[10px] font-bold text-[#201064] uppercase tracking-widest">
              What's Happening
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#201064] tracking-tight">
            Latest News, Events & Achievements
          </h2>

          <p className="mt-4 text-slate-500 text-sm md:text-base max-w-2xl mx-auto font-medium leading-relaxed">
            Explore our journey through groundbreaking innovations, robotics projects, industry collaborations, student success stories, and community impact initiatives.
          </p>

          <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto mt-5 rounded-full"></div>
        </div>

        {/* Responsive Grid with Center Alignment for Last Row */}
        <div className="flex flex-wrap justify-center gap-8">
          {newsItems.map((news) => (
            <div 
              key={news.id} 
              onClick={() => openModal(news)}
              className="w-full sm:w-[calc(50%-16px)] lg:w-[calc(33.333%-22px)] max-w-md flex"
            >
              {/* Premium News Card */}
              <div className="bg-white border border-slate-100 rounded-[20px] overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer flex flex-col justify-between w-full">
                
                {/* Image Section */}
                <div className="h-60 relative overflow-hidden bg-slate-100">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Image overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Date Badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[#201064] font-extrabold text-[11px] px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 border border-white/50">
                    <Calendar size={12} className="stroke-[2.5] text-indigo-600" />
                    <span>{news.date}</span>
                  </div>

                  {/* Category Indicator on Image Bottom */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-indigo-600/90 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md backdrop-blur-sm shadow-sm">
                    {news.icon}
                    <span>{news.category}</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-[#201064] text-lg font-bold leading-snug mb-3 group-hover:text-indigo-600 transition-colors duration-300 line-clamp-2">
                      {news.title}
                    </h3>
                    <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed mb-6 line-clamp-3">
                      {news.shortDescription}
                    </p>
                  </div>

                  {/* Read More button trigger */}
                  <div className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-extrabold text-sm group/btn mt-auto">
                    <span>Read More</span>
                    <ArrowRight size={16} className="transform group-hover/btn:translate-x-1.5 transition-transform duration-300" />
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Modal - News Detail Viewer */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn">
          <div 
            className="bg-white rounded-[24px] max-w-2xl w-full overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh] md:max-h-[85vh] animate-scaleUp border border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition-all hover:scale-105 duration-200"
              aria-label="Close modal"
            >
              <X size={20} className="stroke-[2.5]" />
            </button>

            {/* Modal Image */}
            <div className="h-64 sm:h-72 w-full relative bg-slate-100 flex-shrink-0">
              <img
                src={selectedNews.image}
                alt={selectedNews.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
                  <span className="bg-white/95 text-[#201064] text-[10px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm uppercase tracking-wide">
                    <Calendar size={11} className="stroke-[2.5] text-indigo-600" />
                    {selectedNews.date}
                  </span>
                  <span className="bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                    {selectedNews.icon}
                    {selectedNews.category}
                  </span>
                </div>
                <h2 className="text-white text-xl md:text-2xl font-black leading-tight drop-shadow-sm">
                  {selectedNews.title}
                </h2>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 md:p-8 overflow-y-auto flex-grow text-slate-700 leading-relaxed font-medium">
              <p className="text-slate-800 text-sm md:text-base mb-6 font-semibold leading-relaxed border-l-4 border-indigo-600 pl-4 py-1">
                {selectedNews.shortDescription}
              </p>
              <p className="text-slate-600 text-xs md:text-sm leading-relaxed whitespace-pre-line">
                {selectedNews.fullContent}
              </p>
            </div>

            {/* Modal Footer */}
            <div className="p-5 bg-slate-50 border-t border-slate-100 flex justify-end flex-shrink-0">
              <button
                onClick={closeModal}
                className="bg-[#201064] text-white hover:bg-[#321d96] font-bold px-6 py-2.5 rounded-xl shadow-md transition-all hover:shadow-lg hover:scale-[1.02] active:scale-95 text-sm"
              >
                Close Article
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};

export default LatestNewsEvents;
