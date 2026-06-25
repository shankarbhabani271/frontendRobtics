import { useState } from "react";
import type { Review } from "../../../data/mockProducts";
import { FaStar, FaUser, FaCheckCircle, FaCamera } from "react-icons/fa";
import Swal from "sweetalert2";

interface ReviewsSectionProps {
  reviews: Review[];
  rating: number;
  reviewCount: number;
  onAddReview: (review: Review) => void;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
  rating,
  reviewCount,
  onAddReview,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [userRating, setUserRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [mockFiles, setMockFiles] = useState<string[]>([]);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  // Hardcoded rating breakdown distribution for premium UI visual details
  const distribution = [
    { stars: 5, percentage: 72 },
    { stars: 4, percentage: 16 },
    { stars: 3, percentage: 7 },
    { stars: 2, percentage: 3 },
    { stars: 1, percentage: 2 },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Simulate base64 URL or use a mockup asset URL for uploaded review image
      // Let's use some pre-loaded product assets as mock review images to look beautiful
      const mockImages = [
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=500&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1608564697071-ddf911d837e5?w=500&auto=format&fit=crop&q=60"
      ];
      const selectedMock = mockImages[Math.floor(Math.random() * mockImages.length)];
      setMockFiles((prev) => [...prev, selectedMock]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      Swal.fire({
        title: "Error!",
        text: "Please fill out all fields.",
        icon: "error",
        confirmButtonColor: "#201064"
      });
      return;
    }

    const newReview: Review = {
      id: "r_new_" + Date.now(),
      userName: name,
      rating: userRating,
      date: new Date().toISOString().split("T")[0],
      comment: comment,
      images: mockFiles.length > 0 ? mockFiles : undefined,
    };

    onAddReview(newReview);
    
    // Reset form
    setName("");
    setUserRating(5);
    setComment("");
    setMockFiles([]);
    setShowForm(false);

    Swal.fire({
      title: "Review Submitted!",
      text: "Thank you for sharing your feedback. Your review is now visible.",
      icon: "success",
      confirmButtonColor: "#201064",
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-8">
      
      {/* Section Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#201064]">
            Customer Ratings & Reviews
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Read comments from verified purchasers of this product.
          </p>
        </div>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-[#201064] text-white hover:bg-[#321d96] font-bold px-5 py-3 rounded-lg text-sm transition cursor-pointer self-start sm:self-auto"
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Review Summaries grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left: Overall numbers */}
        <div className="md:col-span-4 text-center border-b md:border-b-0 md:border-r border-slate-100 pb-6 md:pb-0 md:pr-6 space-y-3">
          <h3 className="text-5xl font-extrabold text-[#201064]">
            {rating}
            <span className="text-2xl font-normal text-slate-400">/5</span>
          </h3>
          
          <div className="flex justify-center text-yellow-400 text-xl gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar key={star} className={star <= Math.round(rating) ? "fill-yellow-400" : "text-gray-200"} />
            ))}
          </div>

          <p className="text-sm text-slate-500 font-bold">
            {reviewCount.toLocaleString()} Customer Ratings
          </p>
          <p className="text-xs text-slate-400 leading-normal">
            Ratings and reviews are left by purchasers of the item on SakRobotix.
          </p>
        </div>

        {/* Right: progress breakdown */}
        <div className="md:col-span-8 space-y-2.5">
          {distribution.map((row) => (
            <div key={row.stars} className="flex items-center gap-3 text-sm">
              <span className="w-12 font-bold text-[#201064] flex items-center gap-1 justify-end">
                {row.stars} <FaStar size={10} className="text-slate-400" />
              </span>
              
              <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                  style={{ width: `${row.percentage}%` }}
                />
              </div>

              <span className="w-10 text-right font-semibold text-slate-500">
                {row.percentage}%
              </span>
            </div>
          ))}
        </div>

      </div>

      {/* Write review Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-slate-50 border border-slate-200 rounded-xl p-5 sm:p-6 space-y-4 animate-slideDown"
        >
          <div className="flex justify-between items-center border-b border-slate-200 pb-3">
            <h3 className="font-bold text-[#201064] text-lg">
              Rate & Review this Product
            </h3>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-slate-400 hover:text-rose-500 font-bold text-sm cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Name Input */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#201064]">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:border-indigo-500 text-sm font-medium"
                required
              />
            </div>

            {/* Stars Selector */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#201064] block">
                Your Rating
              </label>
              <div className="flex items-center gap-1.5 h-10">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setUserRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="text-2xl text-slate-300 hover:scale-110 transition cursor-pointer"
                  >
                    <FaStar
                      className={
                        star <= (hoverRating ?? userRating)
                          ? "text-yellow-400"
                          : "text-slate-200"
                      }
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-500 ml-2">
                  ({userRating} Stars)
                </span>
              </div>
            </div>

          </div>

          {/* Comment Area */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#201064]">
              Review Comments
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you like or dislike about this product? How did it help your project?"
              rows={4}
              className="w-full bg-white border border-slate-200 rounded-lg p-4 outline-none focus:border-indigo-500 text-sm font-medium leading-relaxed"
              required
            />
          </div>

          {/* Image Upload mock */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#201064] block">
              Add Photos (Optional)
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl w-24 h-24 cursor-pointer hover:border-indigo-500 hover:bg-slate-100/50 transition">
                <FaCamera className="text-slate-400 mb-1" size={18} />
                <span className="text-[10px] font-bold text-slate-500">
                  Upload
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {/* Uploaded items mock */}
              {mockFiles.map((url, index) => (
                <div
                  key={index}
                  className="w-24 h-24 border border-slate-200 rounded-xl overflow-hidden relative group"
                >
                  <img
                    src={url}
                    alt="Mock upload"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setMockFiles((p) => p.filter((_, i) => i !== index))}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-[8px] opacity-0 group-hover:opacity-100 transition cursor-pointer"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto bg-[#201064] hover:bg-[#321d96] text-white font-bold py-3 px-8 rounded-lg text-sm transition cursor-pointer"
          >
            Submit Review
          </button>
        </form>
      )}

      {/* Customer Reviews Listings */}
      <div className="space-y-6">
        <h3 className="font-bold text-[#201064] text-lg border-b border-slate-100 pb-3">
          Top Reviews ({reviews.length})
        </h3>
        
        {reviews.length === 0 ? (
          <p className="text-sm text-slate-400 py-4 text-center">
            No reviews yet. Be the first to write one!
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {reviews.map((rev) => (
              <div key={rev.id} className="py-5 first:pt-0 last:pb-0 space-y-3 animate-fadeIn">
                
                {/* Author row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 border flex items-center justify-center text-slate-500">
                      <FaUser size={14} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                        {rev.userName}
                        <span className="text-emerald-600 text-[10px] bg-emerald-50 px-1.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                          <FaCheckCircle size={8} /> Verified Purchase
                        </span>
                      </h4>
                      <span className="text-xs text-slate-400 font-semibold">
                        {rev.date}
                      </span>
                    </div>
                  </div>

                  {/* Review Stars badge */}
                  <div className="flex items-center gap-1 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-md text-xs font-bold text-[#201064]">
                    <span>{rev.rating}</span>
                    <FaStar size={10} className="fill-[#201064]" />
                  </div>
                </div>

                {/* Comment Text */}
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  {rev.comment}
                </p>

                {/* Review customer images */}
                {rev.images && rev.images.length > 0 && (
                  <div className="flex gap-2">
                    {rev.images.map((imgUrl, i) => (
                      <button
                        key={i}
                        onClick={() => setLightboxImg(imgUrl)}
                        className="w-16 h-16 border rounded-lg overflow-hidden hover:scale-105 transition duration-200 cursor-zoom-in"
                      >
                        <img
                          src={imgUrl}
                          alt="Review Attachment"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

              </div>
            ))}
          </div>
        )}

      </div>

      {/* Review Image Lightbox */}
      {lightboxImg && (
        <div
          onClick={() => setLightboxImg(null)}
          className="fixed inset-0 bg-black/90 z-[1000] flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-3xl max-h-[85vh] bg-white rounded-xl overflow-hidden p-2">
            <img
              src={lightboxImg}
              alt="Review Attachment Full"
              className="max-w-full max-h-[80vh] object-contain mx-auto"
            />
            <button
              onClick={() => setLightboxImg(null)}
              className="absolute top-4 right-4 bg-black/60 text-white rounded-full p-2.5 hover:bg-black transition cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default ReviewsSection;
