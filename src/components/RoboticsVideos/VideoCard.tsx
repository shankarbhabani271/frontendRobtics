import { useState } from "react";
import { Play } from "lucide-react";

export interface VideoItem {
  id: string;
  title: string;
  channel: string;
  duration: string;
}

interface VideoCardProps {
  video: VideoItem;
  onClick: (video: VideoItem) => void;
}

const VideoCard = ({ video, onClick }: VideoCardProps) => {
  // Use high-performance WebP thumbnail with JPG fallbacks
  const [imgSrc, setImgSrc] = useState(`https://i.ytimg.com/vi_webp/${video.id}/mqdefault.webp`);

  const handleImgError = () => {
    if (imgSrc.includes("vi_webp")) {
      // Fallback 1: High quality JPG
      setImgSrc(`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`);
    } else if (imgSrc.includes("hqdefault.jpg")) {
      // Fallback 2: Medium quality JPG from alternative CDN
      setImgSrc(`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`);
    }
  };

  return (
    <div
      onClick={() => onClick(video)}
      className="group bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col h-full"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
        <img
          src={imgSrc}
          alt={video.title}
          onError={handleImgError}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Play Button (Always visible centered) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg transition-transform duration-300 transform group-hover:scale-110">
            <Play size={24} className="fill-white text-white translate-x-0.5" />
          </div>
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-2.5 right-2.5 bg-slate-950/85 text-white text-[10px] font-bold font-mono px-1.5 py-0.5 rounded shadow-sm">
          {video.duration}
        </div>
      </div>

      {/* Info Container */}
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          <h4 className="font-bold text-blue-600 hover:text-blue-700 text-sm leading-snug line-clamp-2 transition-colors duration-200" title={video.title}>
            {video.title}
          </h4>
          <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mt-1.5">
            {video.channel}
          </p>
        </div>
        
        {/* Play Indicator on bottom */}
        <div className="flex items-center space-x-1 mt-3.5 text-xs text-blue-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span>Watch Video</span>
          <Play size={10} className="fill-blue-600 translate-x-0.5" />
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
