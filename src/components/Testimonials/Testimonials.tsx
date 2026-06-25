import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  designation: string;
  text: string;
  date: string;
  initials: string;
  color: string;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Rajesh Kumar",
    designation: "STEM Robotics Instructor",
    text: "The SakRobotix controller boards have revolutionized how we teach robotics. The built-in protection circuits prevent students from damaging microcontrollers. Extremely robust!",
    date: "3 days ago",
    initials: "RK",
    color: "from-pink-500 to-rose-500",
  },
  {
    id: "2",
    name: "Priya Sharma",
    designation: "IoT Hobbyist & Maker",
    text: "Highly impressed with the quality of these drone kits. The documentation was crystal clear, and I got my quadcopter hovering in under two hours. Phenomenal customer support!",
    date: "1 week ago",
    initials: "PS",
    color: "from-purple-500 to-indigo-500",
  },
  {
    id: "3",
    name: "Vikram Singh",
    designation: "Embedded Systems Engineer",
    text: "I purchase all my microcontrollers and sensors here. Components are 100% genuine, and shipping to Mumbai was exceptionally fast. Best electronic store in India.",
    date: "2 weeks ago",
    initials: "VS",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "4",
    name: "Aarav Mehta",
    designation: "Professional Videographer",
    text: "Finding authentic replacement carbon fiber props and brushless motors was always a chore. SakRobotix has a premium catalog with extremely reasonable pricing.",
    date: "1 month ago",
    initials: "AM",
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "5",
    name: "Ananya Sen",
    designation: "Director, Innovate Space",
    text: "We ordered 20 starter kits for our summer camp. Every single kit arrived perfectly sorted and functional. The students loved building their line-following smart cars.",
    date: "1 month ago",
    initials: "AS",
    color: "from-amber-500 to-orange-500",
  },
  {
    id: "6",
    name: "Rohan Verma",
    designation: "Home Automation Hobbyist",
    text: "Built my entire smart home setup using ESP32 chips and relay shields from SakRobotix. High reliability, zero failures so far. Will continue buying from them.",
    date: "2 months ago",
    initials: "RV",
    color: "from-violet-500 to-purple-500",
  },
  {
    id: "7",
    name: "Sneha Patil",
    designation: "Engineering Student",
    text: "The related product suggestions helped me pick the right capacitors and headers for my project. Saved me from ordering incomplete parts for my finals!",
    date: "2 months ago",
    initials: "SP",
    color: "from-fuchsia-500 to-pink-500",
  },
  {
    id: "8",
    name: "Kabir Joshi",
    designation: "Aerospace Research Assistant",
    text: "Industrial grade components and excellent packaging. Sensors arrived in anti-static bags inside thick bubble-wrap. The attention to packaging details is superb.",
    date: "3 months ago",
    initials: "KJ",
    color: "from-cyan-500 to-blue-500",
  },
];

const Testimonials = () => {
  const [visibleCards, setVisibleCards] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(3);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);
  const autoplayTimer = useRef<any>(null);

  // Handle responsive visible card counts
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleCards(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2);
      } else {
        setVisibleCards(3);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Set initial position based on visibility cloned padding size
  useEffect(() => {
    setCurrentIndex(3);
  }, [visibleCards]);

  // Clone 3 items on left and 3 items on right for seamless looping
  const extendedTestimonials = [
    ...testimonials.slice(-3),
    ...testimonials,
    ...testimonials.slice(0, 3),
  ];

  const handleNext = () => {
    if (!isTransitioning) return;
    setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (!isTransitioning) return;
    setCurrentIndex((prev) => prev - 1);
  };

  const handleTransitionEnd = () => {
    if (currentIndex >= testimonials.length + 3) {
      setIsTransitioning(false);
      setCurrentIndex(3);
    } else if (currentIndex <= 0) {
      setIsTransitioning(false);
      setCurrentIndex(testimonials.length);
    }
  };

  // Re-enable transition after boundary snap resets index
  useEffect(() => {
    if (!isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  // Autoplay Logic
  useEffect(() => {
    if (!isAutoplayPaused && isTransitioning) {
      autoplayTimer.current = setInterval(() => {
        handleNext();
      }, 4000);
    }

    return () => {
      if (autoplayTimer.current) {
        clearInterval(autoplayTimer.current);
      }
    };
  }, [currentIndex, isAutoplayPaused, isTransitioning]);

  const handleDotClick = (index: number) => {
    if (!isTransitioning) return;
    setCurrentIndex(3 + index);
  };

  const activeRealIndex = (currentIndex - 3 + testimonials.length) % testimonials.length;

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-100 overflow-hidden">
      <div className="max-w-7xl xl:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center mb-16 relative">
          <div className="inline-flex items-center space-x-1.5 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full mb-3 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest">
              Customer Trust
            </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#201064] tracking-tight">
            What Our Makers Say
          </h2>
          
          <p className="mt-3 text-slate-500 text-sm md:text-base max-w-xl mx-auto font-medium">
            Over 1,200+ verified customer reviews with a 4.9 out of 5 stars rating on Google Reviews.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mt-5 rounded-full"></div>
        </div>

        {/* Carousel Outer Wrapper */}
        <div 
          className="relative max-w-6xl mx-auto px-4 sm:px-12"
          onMouseEnter={() => setIsAutoplayPaused(true)}
          onMouseLeave={() => setIsAutoplayPaused(false)}
        >
          {/* Slider Content Container */}
          <div className="overflow-hidden py-4">
            <div
              className={`flex ${isTransitioning ? "transition-transform duration-500 ease-in-out" : ""}`}
              style={{
                transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
              }}
              onTransitionEnd={handleTransitionEnd}
            >
              {extendedTestimonials.map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  className="px-3 shrink-0"
                  style={{ width: `${100 / visibleCards}%` }}
                >
                  {/* Testimonial Card */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-[300px] relative group overflow-hidden">
                    
                    {/* Glowing highlight stripe on card hover */}
                    <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                    {/* Top Row: Avatar & Google Badge */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-3.5">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-extrabold text-sm shadow-md border-2 border-white`}>
                          {item.initials}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm leading-snug">
                            {item.name}
                          </h4>
                          <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5">
                            {item.designation}
                          </p>
                        </div>
                      </div>

                      {/* Google Review Badge */}
                      <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-100 rounded-lg p-1 px-2 shadow-inner">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.81-2.6-2.6-4.53-2.6-4.53z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                        </svg>
                        <span className="text-[9px] font-extrabold text-slate-500 font-sans uppercase tracking-tight">Review</span>
                      </div>
                    </div>

                    {/* Middle Section: Testimonial Feedback */}
                    <div className="flex-grow my-4 flex items-center">
                      <blockquote className="text-slate-600 text-xs sm:text-sm leading-relaxed italic line-clamp-4 relative pl-3 border-l-2 border-slate-200">
                        "{item.text}"
                      </blockquote>
                    </div>

                    {/* Bottom Section: Rating & Verification Tag */}
                    <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                      <div>
                        <div className="flex items-center space-x-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium font-mono mt-1">
                          {item.date}
                        </p>
                      </div>

                      <div className="flex items-center space-x-1.5 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-0.5 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[9px] font-bold text-emerald-700 tracking-wider uppercase">
                          Verified Maker
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrow buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-0 sm:-left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 p-2.5 rounded-full shadow-md hover:shadow-lg transition duration-200 z-20 hover:scale-105"
            aria-label="Previous Slide"
          >
            <ChevronLeft size={20} className="stroke-[2.5]" />
          </button>
          
          <button
            onClick={handleNext}
            className="absolute right-0 sm:-right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 p-2.5 rounded-full shadow-md hover:shadow-lg transition duration-200 z-20 hover:scale-105"
            aria-label="Next Slide"
          >
            <ChevronRight size={20} className="stroke-[2.5]" />
          </button>

        </div>

        {/* Pagination indicators (Dots) */}
        <div className="flex justify-center items-center gap-2.5 mt-10">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeRealIndex === index
                  ? "w-7 bg-blue-600 shadow-sm"
                  : "w-2 bg-slate-200 hover:bg-slate-300"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
