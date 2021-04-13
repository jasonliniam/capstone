const express = require('express');
const router = express.Router();
const { teaSchema } = require('../joiSchemas');
const AppError = require('../utilities/AppError');
const asyncCatcher = require('../utilities/asyncCatcher');
const { isAuthenticated, isCreator, validateTea } = require('../middleware/middleware');

const Tea = require('../models/tea');

//------Middleware-------


//render our index route
router.get(
	'/',
	asyncCatcher(async (req, res) => {
		const teas = await Tea.find({});
		res.render('teas/index', { teas });
	})
);
    
//render new form
router.get('/new', isAuthenticated, (req, res) => {
	res.render('teas/new');
});
   
//create a new tea
router.post(
	'/',
	isAuthenticated,
	validateTea,
	asyncCatcher(async (req, res) => {
		const tea = new Tea(req.body.tea);
		tea.submittedBy = req.user._id;
		await tea.save();
		req.flash('success', 'New tea was successfully added!');
		res.redirect(`/teas/${tea.id}`);
	})
);
    
//render show page
router.get(
    '/:id', 
   	asyncCatcher(async (req, res, next) => {
   	const { id } = req.params;
   	const teas = await Tea.findById(id)
	   .populate({
		path: 'reviews',
		populate: {
			path: 'author',
		},
	})
	   .populate('submittedBy');
	   console.log(teas);
   	if (!teas) {
		req.flash('error', 'Tea does not exist!');
		res.redirect("/teas")
   	}
   	res.render('teas/show', { teas });
}));
    
//render the edit form
router.get(
   	'/:id/edit', 
	isAuthenticated,
	isCreator,
   	asyncCatcher (async (req, res) => {
   	const { id } = req.params;
   	const tea = await Tea.findById(id);
	if(!tea) {
		req.flash('error', 'Tea does not exist!');
		res.redirect("/teas")
	}res.render('teas/edit', { tea });
}));

//update tea
router.put(
    "/:id", 
	isAuthenticated,
	isCreator,
    validateTea,
    asyncCatcher(async (req, res) => {
    const { id } = req.params;
    const tea = await Tea.findByIdAndUpdate(id, {
    	...req.body.tea,
    });
    req.flash('success', 'New tea was successfully updated!');
	res.redirect(`/teas/${tea.id}`);
}));
    
//delete tea
router.delete(
    '/:id/delete', 
	isAuthenticated,
	isCreator,
    asyncCatcher(async (req, res) => {
    const { id } = req.params;
    await Tea.findByIdAndDelete(id);
    req.flash('success', 'New tea was successfully deleted!');
	res.redirect('/teas');
}));

module.exports = router;
