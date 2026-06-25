import React, { useState } from "react";
import { type Review } from "../data/mockProducts";
import { FaStar, FaUserCircle, FaPaperPlane } from "react-icons/fa";
import Swal from "sweetalert2";

interface ProductReviewProps {
  initialReviews: Review[];
  productId: string;
}

const ProductReview: React.FC<ProductReviewProps> = ({ initialReviews = [] }) => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [userName, setUserName] = useState("");
  const [comment, setComment] = useState("");

  const ratingCounts = [0, 0, 0, 0, 0]; // Index 0 is 1 star, 4 is 5 stars
  reviews.forEach((r) => {
    const starIdx = Math.max(1, Math.min(5, Math.round(r.rating))) - 1;
    ratingCounts[starIdx]++;
  });

  const totalReviewsCount = reviews.length;
  const avgRating = totalReviewsCount > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviewsCount).toFixed(1)
    : "0.0";

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!userName.trim() || !comment.trim()) {
      Swal.fire({
        title: "Missing Fields",
        text: "Please enter your name and review details.",
        icon: "warning",
        confirmButtonColor: "#201064"
      });
      return;
    }

    const newReview: Review = {
      id: `new-${Date.now()}`,
      userName: userName.trim(),
      rating: newRating,
      date: new Date().toISOString().split("T")[0],
      comment: comment.trim(),
      images: []
    };

    setReviews([newReview, ...reviews]);
    setUserName("");
    setComment("");
    setNewRating(5);

    Swal.fire({
      title: "Review Submitted!",
      text: "Thank you for sharing your feedback.",
      icon: "success",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
      background: "#fff",
      color: "#201064",
      iconColor: "#0A7FE6"
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-4">
      {/* Reviews Summary Column */}
      <div className="lg:col-span-4 bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-[#201064]">Ratings & Reviews</h3>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-5xl font-black text-[#201064]">{avgRating}</span>
            <span className="text-sm text-slate-400 font-semibold">out of 5 stars</span>
          </div>

          <div className="flex items-center gap-1 mt-2">
            <div className="flex text-yellow-400 text-sm gap-0.5">
              {[...Array(5)].map((_, idx) => (
                <FaStar
                  key={idx}
                  className={idx < Math.round(Number(avgRating)) ? "fill-current" : "text-slate-200"}
                />
              ))}
            </div>
            <span className="text-xs text-slate-500 font-bold ml-1.5">
              {totalReviewsCount} {totalReviewsCount === 1 ? "Review" : "Reviews"}
            </span>
          </div>

          {/* Star Breakdown bars */}
          <div className="space-y-2.5 mt-6">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = ratingCounts[stars - 1] || 0;
              const percentage = totalReviewsCount > 0 ? (count / totalReviewsCount) * 100 : 0;
              return (
                <div key={stars} className="flex items-center gap-3 text-xs font-semibold text-slate-600">
                  <span className="w-12 text-right">{stars} Star</span>
                  <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-slate-400">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200/60">
          <p className="text-xs text-slate-400 leading-relaxed font-semibold">
            All reviews on SAKROBOTIX Store are verified and match customers who purchased this exact kit or board.
          </p>
        </div>
      </div>

      {/* Review List & Submission Column */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        
        {/* Write a Review Form */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h4 className="text-base font-bold text-[#201064] mb-4">Write a Customer Review</h4>
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex-1 w-full">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Sharma"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#0A7FE6] focus:bg-white transition px-4 py-2.5 rounded-xl outline-none text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Rating</label>
                <div className="flex items-center h-[42px] gap-1 px-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="text-xl text-yellow-400 hover:scale-110 active:scale-95 transition cursor-pointer"
                    >
                      <FaStar
                        className={
                          star <= (hoverRating ?? newRating)
                            ? "fill-current"
                            : "text-slate-200"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Review Comments</label>
              <textarea
                rows={3}
                placeholder="What did you build with this? How was the setup and documentation?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#0A7FE6] focus:bg-white transition px-4 py-2.5 rounded-xl outline-none text-sm font-semibold resize-none"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 bg-[#201064] hover:bg-[#0A7FE6] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
              >
                <FaPaperPlane size={11} />
                <span>Submit Review</span>
              </button>
            </div>
          </form>
        </div>

        {/* User Reviews List */}
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
          {reviews.length === 0 ? (
            <p className="text-center text-slate-400 py-10 font-medium text-sm">No reviews yet. Be the first to review this product!</p>
          ) : (
            reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm flex gap-4"
              >
                <div className="text-slate-400 flex-shrink-0">
                  <FaUserCircle size={36} />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <h5 className="font-bold text-sm text-[#201064]">{review.userName}</h5>
                    <span className="text-xs text-slate-400 font-semibold">{review.date}</span>
                  </div>

                  <div className="flex text-yellow-400 text-[10px] gap-0.5 mt-1">
                    {[...Array(5)].map((_, idx) => (
                      <FaStar
                        key={idx}
                        className={idx < review.rating ? "fill-current" : "text-slate-200"}
                      />
                    ))}
                  </div>

                  <p className="mt-2.5 text-slate-600 text-sm leading-relaxed font-medium">
                    {review.comment}
                  </p>

                  {/* Review Images */}
                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-2.5 mt-3.5">
                      {review.images.map((img, index) => (
                        <div
                          key={index}
                          className="w-14 h-14 rounded-lg bg-slate-50 border p-1 overflow-hidden hover:scale-105 transition cursor-pointer"
                        >
                          <img src={img} alt="review-user-uploaded" className="w-full h-full object-contain" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default ProductReview;
