import { Eye, Star } from "lucide-react";
import { FaGithub } from "react-icons/fa";

const projects = [
  {
    id: 1,
    image: "/images/project-1.jpg",
    title: "Project 1",
    category: "MERN PROJECT",
    tech: "React • Node • MongoDB",
    views: 384,
  },
  {
    id: 2,
    image: "/images/wilyfoxbhabani1.jpg",
    title: "SakRobotix Bhabani 1",
    category: "FULL STACK",
    tech: "React • Express",
    views: 1248,
  },
  {
    id: 3,
    image: "/images/wilyfoxbhabani2.jpg",
    title: "SakRobotix Bhabani 2",
    category: "WEB APP",
    tech: "MongoDB • JWT",
    views: 512,
  },
  {
    id: 4,
    image: "/images/wilyfoxbhabani3.jpg",
    title: "SakRobotix Bhabani 3",
    category: "PORTFOLIO",
    tech: "React • Tailwind",
    views: 928,
  },
];

export default function ProjectCard() {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >
              {/* Badge */}
              <div className="relative">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-56 object-cover"
                />

                <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Featured
                </span>
              </div>

              {/* Content */}
              <div className="p-5">
                <h4 className="text-blue-600 text-xs font-bold uppercase tracking-wider">
                  {project.category}
                </h4>

                <h3 className="text-lg font-semibold mt-2 text-gray-800">
                  {project.title}
                </h3>

                <div className="flex items-center gap-1 mt-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  ))}

                  <span className="text-sm text-gray-500 ml-1">
                    ({project.views})
                  </span>
                </div>

                <p className="text-gray-600 mt-3 text-sm">
                  {project.tech}
                </p>
              </div>

              {/* Footer Buttons */}
              <div className="grid grid-cols-2">
                <a
                  href="#"
                  className="flex items-center justify-center gap-2 bg-indigo-900 text-white py-3 hover:bg-indigo-800"
                >
                  <Eye size={18} />
                  Demo
                </a>

                <a
                  href="#"
                  className="flex items-center justify-center gap-2 bg-indigo-700 text-white py-3 hover:bg-indigo-600"
                >
                  <FaGithub size={18} />
                  Code
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}