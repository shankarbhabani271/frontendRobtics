import React from "react";
import { FaLinkedinIn, FaGithub, FaTwitter, FaEnvelope } from "react-icons/fa";

// Import instructor images from assets
import instructor1 from "../../assets/profile image 1.png";
import instructor2 from "../../assets/profile iamge 2.png";
import instructor3 from "../../assets/profile image 4.png";
import instructor4 from "../../assets/profile iamge 5.jpeg";

interface Instructor {
  id: number;
  name: string;
  role: string;
  specialization: string;
  image: string;
  email: string;
}

const instructors: Instructor[] = [
  {
    id: 1,
    name: "Dr. Aris Thorne",
    role: "Lead Robotics Scientist",
    specialization: "Autonomous Systems & AI",
    image: instructor1,
    email: "aris.thorne@sakrobotix.com"
  },
  {
    id: 2,
    name: "Elena Rostova",
    role: "Senior IoT Engineer",
    specialization: "Embedded Systems & IoT",
    image: instructor2,
    email: "elena.rostova@sakrobotix.com"
  },
  {
    id: 3,
    name: "Marcus Vance",
    role: "Drone Tech Specialist",
    specialization: "Aerial Robotics & Guidance",
    image: instructor3,
    email: "marcus.vance@sakrobotix.com"
  },
  {
    id: 4,
    name: "Dr. Bhabani shankar",
    role: "Mechatronics Instructor",
    specialization: "Kinematics & Control Systems",
    image: instructor4,
    email: "shankarbhabani271@gmail.com"
  }
];

const RoboticsInstructors: React.FC = () => {
  return (
    <section id="robotics-instructors" className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Decorative subtle background accents */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-12 left-12 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute bottom-12 right-12 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="uppercase tracking-[4px] text-xs font-extrabold text-[#1a0e53] bg-indigo-50 px-4 py-2 rounded-full">
            Faculty & Experts
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#1a0e53] mt-5 tracking-tight">
            The Minds Behind Innovation
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mt-4 rounded-full"></div>
          <p className="text-slate-500 max-w-xl mx-auto mt-5 text-sm sm:text-base font-medium">
            Learn from industry-leading scientists and engineers committed to mentoring the next generation of innovators.
          </p>
        </div>

        {/* Instructors Responsive Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {instructors.map((instructor) => (
            <div
              key={instructor.id}
              className="group relative bg-white rounded-3xl p-8 shadow-sm hover:shadow-2xl border border-slate-100 flex flex-col items-center transition-all duration-500 hover:-translate-y-2 overflow-hidden text-center cursor-default"
            >
              {/* Hover Gradient Background Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a0e53] via-[#3c096c] to-[#7209b7] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />

              {/* Card Content Wrapper */}
              <div className="relative z-10 flex flex-col items-center w-full">
                {/* Profile Image Container */}
                <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-slate-50 shadow-md mb-6 group-hover:border-white/20 transition-all duration-500">
                  <img
                    src={instructor.image}
                    alt={instructor.name}
                    className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                {/* Name */}
                <h3 className="text-xl font-extrabold text-slate-800 group-hover:text-white transition-colors duration-500 mb-1">
                  {instructor.name}
                </h3>

                {/* Role / Designation */}
                <p className="text-xs font-bold text-indigo-600 group-hover:text-cyan-300 transition-colors duration-500 mb-4 uppercase tracking-wider">
                  {instructor.role}
                </p>

                {/* Department / Specialization Badge */}
                <span className="inline-block px-3.5 py-1 text-[11px] font-bold rounded-full bg-slate-100 text-slate-600 group-hover:bg-white/10 group-hover:text-slate-100 transition-all duration-500">
                  {instructor.specialization}
                </span>

                {/* Divider & Social Icons */}
                <div className="flex space-x-3 mt-6 pt-6 border-t border-slate-100/80 group-hover:border-white/10 w-full justify-center transition-colors duration-500">
                  <a
                    href={`mailto:${instructor.email}`}
                    title="Send Email"
                    className="p-2.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 group-hover:text-slate-300 group-hover:hover:text-white group-hover:hover:bg-white/10 transition-all duration-300 animate-none"
                  >
                    <FaEnvelope size={16} />
                  </a>
                  <a
                    href="#"
                    title="LinkedIn Profile"
                    className="p-2.5 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 group-hover:text-slate-300 group-hover:hover:text-white group-hover:hover:bg-white/10 transition-all duration-300"
                  >
                    <FaLinkedinIn size={16} />
                  </a>
                  <a
                    href="#"
                    title="GitHub Profile"
                    className="p-2.5 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-50 group-hover:text-slate-300 group-hover:hover:text-white group-hover:hover:bg-white/10 transition-all duration-300"
                  >
                    <FaGithub size={16} />
                  </a>
                  <a
                    href="#"
                    title="Twitter Profile"
                    className="p-2.5 rounded-full text-slate-400 hover:text-sky-500 hover:bg-sky-50 group-hover:text-slate-300 group-hover:hover:text-white group-hover:hover:bg-white/10 transition-all duration-300"
                  >
                    <FaTwitter size={16} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoboticsInstructors;
