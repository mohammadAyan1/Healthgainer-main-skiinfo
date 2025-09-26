'use client';
import { useState, useMemo, useCallback } from 'react';
import { FaStar } from 'react-icons/fa';
import { addReview } from '@/redux/slices/reviewSlice';
import { useDispatch, useSelector } from "react-redux";

export default function ReviewSection({ productId }) {
    const dispatch = useDispatch();
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [reviewTitle, setReviewTitle] = useState('');
    const [reviewText, setReviewText] = useState('');
    const [isWritingReview, setIsWritingReview] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const { reviews = [] } = useSelector((state) => state?.review || {});

    const averageRating = useMemo(() => 
        reviews.length 
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) 
            : 0,
        [reviews]
    );

    const reviewsCount = useMemo(() => reviews.length, [reviews]);
    const starsArray = useMemo(() => [...Array(5)], []);
    const ratingStarsArray = useMemo(() => [...Array(5)], []);

    const toggleReviewForm = useCallback(() => {
        setIsWritingReview(prev => !prev);
    }, []);

    const handleCancel = useCallback(() => {
        setIsWritingReview(false);
    }, []);

    const handleStarClick = useCallback((starValue) => {
        setRating(starValue);
    }, []);

    const handleStarHover = useCallback((starValue) => {
        setHover(starValue);
    }, []);

    const handleStarHoverLeave = useCallback(() => {
        setHover(0);
    }, []);

    const handleTitleChange = useCallback((e) => {
        setReviewTitle(e.target.value);
    }, []);

    const handleTextChange = useCallback((e) => {
        setReviewText(e.target.value);
    }, []);

    const handleSubmit = useCallback(async () => {
        if (!rating || !reviewTitle || !reviewText) {
            setError("All fields are required");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await dispatch(addReview({ 
                productId, 
                rating, 
                title: reviewTitle, 
                comment: reviewText 
            })).unwrap();
            
            setIsWritingReview(false);
            setReviewTitle('');
            setReviewText('');
            setRating(0);
        } catch (err) {
            setError(err.message || "Failed to submit review");
        } finally {
            setLoading(false);
        }
    }, [rating, reviewTitle, reviewText, productId, dispatch]);

    const ratingDisplay = useMemo(() => (
        <div className="flex text-primary">
            {starsArray.map((_, index) => (
                <FaStar
                    key={index}
                    className={`text-lg ${index < averageRating ? "text-yellow-400" : "text-gray-300"}`}
                />
            ))}
        </div>
    ), [starsArray, averageRating]);

    const starRatingInput = useMemo(() => (
        <div className="flex justify-center mt-2">
            {ratingStarsArray.map((_, index) => {
                const starValue = index + 1;
                return (
                    <FaStar
                        key={index}
                        className={`text-2xl cursor-pointer transition-all ${starValue <= (hover || rating) ? 'text-primary' : 'text-gray-300'}`}
                        onMouseEnter={() => handleStarHover(starValue)}
                        onMouseLeave={handleStarHoverLeave}
                        onClick={() => handleStarClick(starValue)}
                    />
                );
            })}
        </div>
    ), [ratingStarsArray, hover, rating, handleStarHover, handleStarHoverLeave, handleStarClick]);

    return (
        <div className="mx-auto md:w-1/2 p-6 bg-white">
            <h2 className="text-xl font-semibold text-center">Customer Reviews</h2>
            <div className="flex items-center justify-between mt-4">
                <div className="flex flex-col items-center">
                    {ratingDisplay}
                    <span className="ml-2 text-gray-700 text-sm">{averageRating} out of 5</span>
                    <p className="text-center text-gray-500 text-sm">Based on {reviewsCount} reviews</p>
                </div>
                <button
                    className="mt-4 bg-primary text-white px-2 py-2 rounded-lg hover:bg-secondary"
                    onClick={toggleReviewForm}
                >
                    {isWritingReview ? 'Cancel review' : 'Write review'}
                </button>
            </div>
            {isWritingReview && (
                <div className="mt-6 border-t pt-4 transition-all duration-300">
                    <h3 className="text-lg font-semibold text-center">Write a review</h3>
                    {starRatingInput}
                    <div className="mt-4">
                        <label className="block font-medium text-sm mb-1">REVIEW TITLE</label>
                        <input
                            type="text"
                            className="w-full border border-primary p-2 rounded-md"
                            placeholder="Give your review a title"
                            value={reviewTitle}
                            onChange={handleTitleChange}
                        />
                    </div>
                    <div className="mt-4">
                        <label className="block font-medium text-sm mb-1">REVIEW</label>
                        <textarea
                            className="w-full border p-2 rounded-md"
                            placeholder="Write your comments here"
                            rows="4"
                            value={reviewText}
                            onChange={handleTextChange}
                        ></textarea>
                    </div>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                    <div className="border-t mt-4 pt-4 flex justify-between">
                        <button
                            className="mt-4 bg-gray-300 text-black p-1 px-2 md:px-2 md:py-2 rounded-lg md:w-1/3 hover:bg-gray-400"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                        <button
                            className="mt-4 bg-primary text-white p-1 px-2 md:px-2 md:py-2 rounded-lg md:w-1/3 hover:bg-secondary"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? "Submitting..." : "Submit Review"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}