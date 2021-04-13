const mongoose = require('mongoose');
const Tea = require('../models/tea');

//Mongoose connecting to Mongo
mongoose
	.connect('mongodb://localhost:27017/teaCapstone', {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
	});
	
	const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log('Database connected');
});
	
	const sampleData = [
    {
		name: 'Oolong', 
		description: 'Organic oolong tea is a variety exclusive to Hualien. The tea shows beautiful bright and gold color and has an aroma elegent and sweet taste.',
		image: 'https://www.dancing-tea.com.tw/UploadFile/GoodPic/35/middle/147305527112135.jpg',
		price: '$',
		caffeine: "Medium",
		submittedBy: "606f49963c45925cf43c614e",
	},
    {
		name: 'Black', 
		description: 'Our organic black tea is grown in the mountains of Hualien along the Eastern coast of Taiwan. It has fortified flavors of honey, fruit, flowers. It can be enjoyed both cold and hot.',
		image: 'https://www.dancing-tea.com.tw/UploadFile/GoodPic/35/middle/147305527112135.jpg',
		price: '$',
		caffeine: "Medium",
		submittedBy: "606f49963c45925cf43c614e",
	},
    {
		name: 'Green', 
		description: 'Organic green tea is a healthy drink with a light floral aroma and slightly bittersweet lingering aftertaste.',
		image: 'https://www.dancing-tea.com.tw/UploadFile/GoodPic/35/middle/147305527112135.jpg',
		price: '$',
		caffeine: "Medium",
		submittedBy: "606f49963c45925cf43c614e",
	},
    {
		name: 'Corn', 
		description: 'Our corn tea is made from 100% organic baby corn and corn tassel from Eastern Taiwan. Picked at the hight of freshness, the tea reserves natural corn sweetness and has a full bodied taste.',
		image: 'https://www.dancing-tea.com.tw/UploadFile/GoodPic/35/middle/147305527112135.jpg',
		price: '$',
		caffeine: "Medium",
		submittedBy: "606f49963c45925cf43c614e",
	},
]

// We first clear our database and then add in our tea sample
const seedDB = async () => {
	await Tea.deleteMany({});
	const res = await Tea.insertMany(sampleData)
		.then((data) => console.log('Data inserted'))
		.catch((e) => console.log(e));
};

// We run our seeder function then close the database after.
seedDB().then(() => {
	mongoose.connection.close();
});
