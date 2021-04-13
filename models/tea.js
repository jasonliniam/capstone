const mongoose = require("mongoose");
const Review = require('./review');
const Schema = mongoose.Schema;

const TeaSchema = new Schema({
	name: String,
    description: String,
    image: String,
    caffeine: String,
    price: String,
	submittedBy: {
		type: Schema.Types.ObjectId,
		ref: "User"
	},
    reviews: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Review',
		},
	],
});

module.exports = mongoose.model('Tea', TeaSchema);

TeaSchema.post('findOneAndDelete', async function (data) {
	if (data) {
		await Review.deleteMany({
			_id: {
				$in: data.reviews,
			},
		});
	}
});
