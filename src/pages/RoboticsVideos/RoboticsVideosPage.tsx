import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, Video, Home } from "lucide-react";
import VideoCard from "../../components/RoboticsVideos/VideoCard";
import type { VideoItem } from "../../components/RoboticsVideos/VideoCard";
import VideoPlayerModal from "../../components/RoboticsVideos/VideoPlayerModal";
import { roboticsVideos } from "../../components/RoboticsVideos/videosData";

const ITEMS_PER_PAGE = 6;

const RoboticsVideosPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  // Scroll to top of window on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const totalPages = Math.ceil(roboticsVideos.length / ITEMS_PER_PAGE);

  // Get current page items
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentVideos = roboticsVideos.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 lg:py-16">
      <div className="max-w-7xl xl:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs & Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <nav className="flex items-center space-x-2 text-xs font-semibold text-slate-400">
            <Link to="/" className="flex items-center hover:text-blue-600 transition duration-150">
              <Home size={14} className="mr-1" />
              <span>Home</span>
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-600 font-bold">Robotics Videos</span>
          </nav>

          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-blue-600 bg-white border border-slate-200 p-2.5 px-4 rounded-xl shadow-sm hover:shadow transition duration-200"
          >
            <ArrowLeft size={14} />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Header Title */}
        <div className="bg-white border border-slate-100 rounded-3xl p-8 lg:p-10 mb-10 shadow-sm relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#38bdf8_1px,transparent_1px),linear-gradient(to_bottom,#38bdf8_1px,transparent_1px)] bg-[size:30px_30px]" />
          
          <div className="relative z-10 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/10">
              <Video size={24} className="stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#201064] tracking-tight">
                All Robotics Videos
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                Explore robotics labs, drone parkour, and detailed maker tutorial builds.
              </p>
            </div>
          </div>

          <div className="relative z-10 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2 text-xs font-bold text-blue-700">
            {roboticsVideos.length} Videos Available
          </div>
        </div>

        {/* Video Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {currentVideos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onClick={(v) => setActiveVideo(v)}
            />
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            
            {/* Prev Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2.5 rounded-xl border border-slate-200 shadow-sm transition duration-200 ${
                currentPage === 1
                  ? "bg-slate-100 text-slate-300 cursor-not-allowed border-slate-100"
                  : "bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 cursor-pointer"
              }`}
              aria-label="Go to previous page"
            >
              <ChevronLeft size={16} className="stroke-[2.5]" />
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 rounded-xl border font-bold text-sm transition-all duration-200 cursor-pointer ${
                  currentPage === page
                    ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/15"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                }`}
                aria-label={`Go to page ${page}`}
              >
                {page}
              </button>
            ))}

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2.5 rounded-xl border border-slate-200 shadow-sm transition duration-200 ${
                currentPage === totalPages
                  ? "bg-slate-100 text-slate-300 cursor-not-allowed border-slate-100"
                  : "bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 cursor-pointer"
              }`}
              aria-label="Go to next page"
            >
              <ChevronRight size={16} className="stroke-[2.5]" />
            </button>

          </div>
        )}

      </div>

      {/* Video Player Modal */}
      <VideoPlayerModal
        video={activeVideo}
        onClose={() => setActiveVideo(null)}
      />
    </div>
  );
};

export default RoboticsVideosPage;
