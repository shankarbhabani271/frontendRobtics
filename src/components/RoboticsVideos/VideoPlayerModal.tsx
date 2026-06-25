import { useEffect } from "react";
import { X } from "lucide-react";
import type { VideoItem } from "./VideoCard";

interface VideoPlayerModalProps {
  video: VideoItem | null;
  onClose: () => void;
}

const VideoPlayerModal = ({ video, onClose }: VideoPlayerModalProps) => {
  // Listen for Escape key press to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (video) {
      window.addEventListener("keydown", handleKeyDown);
      // Disable body scroll when modal is open
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [video, onClose]);

  if (!video) return null;

  const embedUrl = `https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Dimmed Blurred Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300"
        aria-hidden="true"
      />

      {/* Modal Content Wrapper */}
      <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl w-full max-w-4xl aspect-video border border-slate-800 z-10 scale-95 md:scale-100 transition-transform duration-300 animate-in fade-in zoom-in-95">
        
        {/* Close Button X */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 sm:top-4 sm:right-4 z-20 bg-slate-900/90 text-white hover:bg-red-600 p-2 rounded-full border border-slate-700/80 hover:border-red-500 shadow-md transition-all duration-200 cursor-pointer"
          aria-label="Close video player"
        >
          <X size={20} className="stroke-[2.5]" />
        </button>

        {/* Embedded IFrame Player */}
        <iframe
          src={embedUrl}
          title={`YouTube video player: ${video.title}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full"
        />

      </div>
    </div>
  );
};

export default VideoPlayerModal;
