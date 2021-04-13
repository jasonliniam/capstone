const express = require("express");
const router = express.Router({ mergeParams: true });
const { reviewSchema } = require('../joiSchemas');
const AppError = require('../utilities/AppError');
const asyncCatcher = require('../utilities/asyncCatcher');
const { validateReview, isAuthenticated, isReviewCreator } =require('../middleware/middleware')

const Tea = require('../models/tea');
const Review = require('../models/review');

//------Middleware-------


// ---review routes---
// create a new review

router.post(
	'/',
	isAuthenticated,
	validateReview,
	asyncCatcher (async (req, res) => {
		const { id } = req.params;
		const tea = await Tea.findById(id);
		const review = new Review(req.body.review);
		review.author = req.user._id;
		tea.reviews.push(review);
		await review.save();
		await tea.save();
		req.flash('success', 'New review was successfully added!');
        res.redirect(`/teas/${id}`);
	})
);

router.delete(
	'/:reviewId',
	isAuthenticated,
	isReviewCreator,
	asyncCatcher(async (req, res) => {
		const { id, reviewId } = req.params;
		await Tea.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
		await Review.findByIdAndDelete(reviewId);
        req.flash('success', 'New review was successfully deleted!');
        res.redirect(`/teas/${id}`);
	})
);

module.exports = router