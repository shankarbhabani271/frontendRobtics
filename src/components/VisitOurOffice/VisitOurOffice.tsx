import React from "react";
import { MapPin, Phone, Mail, Clock, Compass, Building2 } from "lucide-react";

const VisitOurOffice: React.FC = () => {
  const directionsUrl = "https://www.google.com/maps/dir/?api=1&destination=SakRobotix+Lab+Pvt.+Ltd.+CTET-INOVEX+CIPET-IPT+Patia+Bhubaneswar+Odisha+India";

  return (
    <section id="visit-us" className="py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase font-extrabold text-[#201064]/80 tracking-[4px] block mb-3">
            Location
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#201064] tracking-tight">
            Visit Our Office
          </h2>
          <p className="mt-4 text-slate-500 text-sm md:text-base max-w-2xl mx-auto font-medium leading-relaxed">
            We welcome students, professionals, and technology enthusiasts to visit our innovation center and explore the future of robotics, AI, and automation.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#201064] to-indigo-600 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Layout Grid */}
        <div className="grid gap-10 lg:grid-cols-5 items-stretch">
          
          {/* Location Info Card */}
          <div className="lg:col-span-2 bg-slate-50 border border-slate-100 rounded-[24px] p-8 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              {/* Header inside Card */}
              <div className="flex items-center gap-3.5 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <Building2 size={22} className="stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-[#201064] text-xl font-bold leading-tight">
                    SakRobotix Lab Pvt. Ltd.
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold tracking-wide uppercase mt-0.5">
                    Robotics Innovation Center
                  </p>
                </div>
              </div>

              {/* Details List */}
              <div className="space-y-6">
                
                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/60 flex items-center justify-center text-slate-500 shadow-sm shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Address</h4>
                    <p className="text-slate-600 text-sm font-semibold mt-0.5 leading-relaxed">
                      CTET-INOVEX, CIPET-IPT, Patia,<br />
                      Bhubaneswar, Odisha, India
                    </p>
                  </div>
                </div>

                {/* Contact Number */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/60 flex items-center justify-center text-slate-500 shadow-sm shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Contact Number</h4>
                    <a href="tel:+919437142878" className="text-slate-600 hover:text-indigo-600 text-sm font-semibold mt-0.5 block transition-colors duration-200">
                      +91 94371 42878
                    </a>
                  </div>
                </div>

                {/* Email Address */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/60 flex items-center justify-center text-slate-500 shadow-sm shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Email Address</h4>
                    <a href="mailto:info@sakrobotix.com" className="text-slate-600 hover:text-indigo-600 text-sm font-semibold mt-0.5 block transition-colors duration-200">
                      info@sakrobotix.com
                    </a>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/60 flex items-center justify-center text-slate-500 shadow-sm shrink-0">
                    <Clock size={18} />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Business Hours</h4>
                    <p className="text-slate-600 text-sm font-semibold mt-0.5">
                      Mon - Sat: 9:00 AM - 6:00 PM
                    </p>
                    <span className="text-[11px] font-bold text-rose-500 block mt-0.5 uppercase tracking-wide">
                      Sunday: Closed
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Directions Button */}
            <div className="mt-10">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#201064] hover:bg-[#321d96] text-white font-bold py-4 px-6 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-98 transition-all duration-300 text-sm"
              >
                <Compass size={18} className="stroke-[2.2] animate-spin-slow" />
                <span>Get Directions</span>
              </a>
            </div>

          </div>

          {/* Map Embed Container */}
          <div className="lg:col-span-3 rounded-[24px] overflow-hidden border border-slate-100 shadow-md hover:shadow-2xl transition-all duration-300 flex">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3740.9501631444737!2d85.8163565!3d20.3436774!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a190a1c75e26171%3A0x6cd691b1f0b070f5!2sSakRobotix%20Lab%20Pvt.%20Ltd.!5e0!3m2!1sen!2sin!4v1781612356286!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "450px" }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="SakRobotix Lab Location Map"
            />
          </div>

        </div>

      </div>
    </section>
  );
};

export default VisitOurOffice;
