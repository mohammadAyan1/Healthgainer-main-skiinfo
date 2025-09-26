const Review = require("../models/reviewModel");

// @desc Create a review
// @route POST /api/reviews
// @access Private
exports.createReview = async (req, res) => {
  try {
    const { productId, rating, title, comment } = req.body;
    console.log(req.body);
    

    if (!productId || !rating || !title || !comment) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const review = new Review({
      productId,
      userId: req.id, 
      rating,
      title,
      comment,
    });

    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all reviews for a product
// @route GET /api/reviews/:productId
// @access Public
exports.getReviewsByProduct = async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).populate("userId", "firstName lastName");
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete a review
// @route DELETE /api/reviews/:id
// @access Private
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Ensure user deleting the review is the owner
    if (review.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await review.deleteOne();
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
