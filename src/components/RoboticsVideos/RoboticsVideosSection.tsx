import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Video } from "lucide-react";
import VideoCard from "./VideoCard";
import type { VideoItem } from "./VideoCard";
import VideoPlayerModal from "./VideoPlayerModal";
import { roboticsVideos } from "./videosData";

const RoboticsVideosSection = () => {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  // Take the first 4 videos as featured videos
  const featuredVideos = roboticsVideos.slice(0, 4);

  return (
    <section className="py-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl xl:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
              <Video size={20} className="stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#201064] tracking-tight">
                Robotics Videos
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                Watch dynamic and instructional drone and robotics builds.
              </p>
            </div>
          </div>

          <Link
            to="/robotics-videos"
            className="inline-flex items-center space-x-2 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-slate-700 hover:text-blue-600 font-bold px-5 py-2.5 rounded-xl transition-all duration-300 shadow-sm cursor-pointer group text-sm self-stretch sm:self-auto justify-center"
          >
            <span>View All Videos</span>
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform duration-200" />
          </Link>
        </div>

        {/* Video Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredVideos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onClick={(v) => setActiveVideo(v)}
            />
          ))}
        </div>

      </div>

      {/* Video Player Modal */}
      <VideoPlayerModal
        video={activeVideo}
        onClose={() => setActiveVideo(null)}
      />
    </section>
  );
};

export default RoboticsVideosSection;
