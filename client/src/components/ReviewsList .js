import { useState, useEffect, useMemo, useCallback } from "react";
import { FaChevronDown, FaStar, FaUserCircle, FaVideo, FaThumbsUp } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviews } from "@/redux/slices/reviewSlice";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ReviewSortDropdown = ({ onSortChange }) => {
  const [selectedOption, setSelectedOption] = useState("Most Recent");
  const [isOpen, setIsOpen] = useState(false);
  
  const options = useMemo(() => [
    { label: "Most Recent", icon: null },
    { label: "Highest Rating", icon: <FaStar className="text-yellow-400 mr-2" /> },
    { label: "Lowest Rating", icon: <FaStar className="text-gray-300 mr-2" /> },
  ], []);

  const toggleDropdown = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleSelect = useCallback((option) => {
    setSelectedOption(option);
    onSortChange(option);
    setIsOpen(false);
  }, [onSortChange]);

  return (
    <div className="relative inline-block text-left w-full sm:w-auto">
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-between w-full sm:w-48 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm sm:text-base text-primary font-medium hover:bg-gray-50 transition-colors duration-200"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {selectedOption}
        <FaChevronDown className={`text-xs transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full sm:w-56 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden">
          {options.map(({label, icon}, index) => (
            <button
              key={index}
              onClick={() => handleSelect(label)}
              className={`flex items-center px-4 py-3 text-left w-full text-gray-700 hover:bg-gray-50 transition-colors duration-150 ${
                selectedOption === label ? "bg-gray-50 font-semibold text-primary" : ""
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ReviewCard = ({ review }) => {
  const [expanded, setExpanded] = useState(false);
  const maxPreviewLength = 150;

  const { shouldTruncate, displayText } = useMemo(() => {
    const shouldTruncate = review.comment.length > maxPreviewLength;
    const displayText = expanded 
      ? review.comment 
      : shouldTruncate 
        ? `${review.comment.substring(0, maxPreviewLength)}...` 
        : review.comment;
    
    return { shouldTruncate, displayText };
  }, [review.comment, expanded]);

  const toggleExpanded = useCallback(() => {
    setExpanded(prev => !prev);
  }, []);

  const starsArray = useMemo(() => [...Array(5)], []);
  const formattedDate = useMemo(() => 
    new Date(review.createdAt).toLocaleDateString(),
    [review.createdAt]
  );

  return (
    <div className="border-b border-gray-100 pb-6 mb-6 last:border-0 last:mb-0">
      <div className="flex justify-between items-start">
        <div className="flex">
          {starsArray.map((_, index) => (
            <FaStar 
              key={index} 
              className={`text-lg ${index < review.rating ? "text-yellow-400" : "text-gray-300"}`} 
            />
          ))}
        </div>
        <span className="text-xs text-gray-500">
          {formattedDate}
        </span>
      </div>

      <div className="flex items-center gap-3 mt-3">
        <FaUserCircle className="text-gray-400 text-2xl" />
        <div>
          <span className="text-sm font-medium text-gray-800">
            {review.userId.firstName} {review.userId.lastName}
          </span>
          {review.verifiedPurchase && (
            <span className="block text-xs text-green-600">Verified Purchase</span>
          )}
        </div>
      </div>

      <h3 className="font-bold mt-2 text-gray-900">{review.title}</h3>
      <p className="text-gray-600 mt-1 text-sm">
        {displayText}
        {shouldTruncate && (
          <button 
            onClick={toggleExpanded} 
            className="ml-1 text-primary font-medium hover:underline"
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
      </p>

      {review.media?.length > 0 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
          {review.media.map((item, index) => (
            <div key={index} className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
              {item.type === 'image' ? (
                <img 
                  src={item.url} 
                  alt="Review media" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <FaVideo className="text-gray-400" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center gap-4">
        <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary">
          <FaThumbsUp className="text-sm" />
          Helpful ({review.helpfulCount || 0})
        </button>
        <button className="text-xs text-gray-500 hover:text-primary">
          Report
        </button>
      </div>
    </div>
  );
};

const ReviewsSkeleton = () => {
  const skeletonItems = useMemo(() => [...Array(3)], []);
  
  return (
    <div className="space-y-6">
      {skeletonItems.map((_, index) => (
        <div key={index} className="border-b border-gray-100 pb-6">
          <div className="flex justify-between">
            <Skeleton width={100} height={20} />
            <Skeleton width={60} height={15} />
          </div>
          <div className="flex items-center mt-3 gap-3">
            <Skeleton circle width={32} height={32} />
            <Skeleton width={120} height={15} />
          </div>
          <Skeleton width={180} height={20} className="mt-2" />
          <Skeleton count={2} className="mt-1" />
          <Skeleton width={80} height={15} className="mt-2" />
        </div>
      ))}
    </div>
  );
};

export default function ReviewsList({ productId }) {
  const dispatch = useDispatch();
  const { reviews = [], loading, error } = useSelector((state) => state?.review || {});
  const [sortedReviews, setSortedReviews] = useState([]);

  useEffect(() => {
    dispatch(fetchReviews(productId));
  }, [dispatch, productId]);

  useEffect(() => {
    if (reviews) {
      setSortedReviews([...reviews]);
    }
  }, [reviews]);

  const handleSortChange = useCallback((option) => {
    let sorted = [...reviews];

    switch (option) {
      case "Highest Rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "Lowest Rating":
        sorted.sort((a, b) => a.rating - b.rating);
        break;
      case "Only Pictures":
        sorted = sorted.filter(review => review.media?.some(m => m.type === 'image'));
        break;
      case "Pictures First":
        sorted.sort((a, b) => {
          const aHasImages = a.media?.some(m => m.type === 'image');
          const bHasImages = b.media?.some(m => m.type === 'image');
          return bHasImages - aHasImages;
        });
        break;
      case "Videos First":
        sorted.sort((a, b) => {
          const aHasVideos = a.media?.some(m => m.type === 'video');
          const bHasVideos = b.media?.some(m => m.type === 'video');
          return bHasVideos - aHasVideos;
        });
        break;
      case "Most Helpful":
        sorted.sort((a, b) => (b.helpfulCount || 0) - (a.helpfulCount || 0));
        break;
      default: 
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setSortedReviews(sorted);
  }, [reviews]);

  const reviewsCount = useMemo(() => sortedReviews.length, [sortedReviews]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Customer Reviews
          {reviewsCount > 0 && (
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({reviewsCount})
            </span>
          )}
        </h2>
        <ReviewSortDropdown onSortChange={handleSortChange} />
      </div>

      {loading ? (
        <ReviewsSkeleton />
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Error loading reviews: {error}
              </p>
            </div>
          </div>
        </div>
      ) : sortedReviews.length === 0 ? (
        <div className="text-center py-10">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <FaStar className="w-full h-full" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No reviews yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Be the first to review this product!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedReviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}