if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require("mongoose");

const Tea = require("./models/tea");
const Review = require('./models/review');

const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const AppError = require("./utilities/AppError");
const asyncCatcher = require('./utilities/asyncCatcher');
const Joi = require("joi");
const { teaSchema, reviewSchema } = require('./joiSchemas');

//import routes
const teaRoutes = require("./routes/teas")
const reviewRoutes = require('./routes/reviews');
const authRoutes = require('./routes/users');

const session = require('express-session');
const flash = require("connect-flash");

const passport = require("passport");
const PassportLocal = require("passport-local");
const User = require('./models/user');

const MongoStore = require('connect-mongo');

//mongodb://localhost:27017/teaCapstone

const url = process.env.DB_STRING || 'mongodb://localhost:27017/teaCapstone'

//Mongoose connecting to Mongo
mongoose
	.connect(url, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
	});

	const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log('Database connected');
});

//Setting up EJS and its pathing
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.engine("ejs", ejsMate);

//parsing the form body
app.use(express.urlencoded({extended: true}));

//method override
app.use(methodOverride("_method"));

//Making public folder available
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, '/public')));

// This creates a new store with settings that we will pass into our session config.
//DB_STRING=mongodb+srv://jason:jason1234@capstone.zy64b.mongodb.net/myFirstDatabase?retryWrites=true&w=majority 
const secret = process.env.SECRET || 'drake'

const store = MongoStore.create({
	mongoUrl: url,
	touchAfter: 24 * 60 * 60,
	crypto: {
		// This is now dymanic
		secret
	},
});

// This checks for any errors that may occur.
store.on('error', (e) => {
	console.log('Store Error', e);
});

// Express Session
const sessionConfig = {
	store,
	secret,
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
	},
};
app.use(session(sessionConfig));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new PassportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//------Middleware-------

app.use((req, res, next) => {
	res.locals.user = req.user;
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next();
});

//------Routes-----------
app.get('/', (req, res) => {
	res.render('home');
});


//------tea routes--------
app.use('/teas', teaRoutes);

app.use('/teas/:id/reviews', reviewRoutes);

app.use('/', authRoutes);

app.use('*', (req, res, next) => {
	next(new AppError('Page Not Found'), 404);
});

app.use((err, req, res, next) => {
	const { status = 500 } = err;
	const { message = 'I am in danger' } = err;
	res.status(status).render('errors', { err });
});

app.listen(3000, () => {
	console.log('Running on port 3000');
});
