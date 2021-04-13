const Joi = require('joi');

module.exports.teaSchema = Joi.object({
    tea: Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.string().required(),
        caffeine: Joi.string().required(),
        price: Joi.string().required(),
        }),
});

module.exports.reviewSchema = Joi.object({
	review: Joi.object({
		body: Joi.string().required(),
		rating: Joi.number().required().min(1).max(5),
	}).required(),
});
