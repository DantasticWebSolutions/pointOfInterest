const session = require('express-session');
const passport = require('passport');
const bcrypt = require('bcrypt');
const localStrategy = require('passport-local').Strategy;
module.exports = (app) => {
	// Call the model
	const User = require('../models/user_model.js');

	//SET Controller
	const data = require('../controllers/controllers.js');
	const express = require('express');

	//Set middleware, all the data will be parsed to json
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));

	// ### PASSPORT ###

	// Every time the app is used a new session is created
	// parameters:
	app.use(
		session({
			secret: 'dandandan',
			resave: false,
			saveUninitialized: true
		})
	);

	// PASSPORT checks if the user has been authenticated
	app.use(passport.initialize());
	app.use(passport.session());

	// Which data to store in the session
	// to add the user detail in the session
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	// When move from one page to another
	// to read the user detail in the session
	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});

	// Use passport to check if username and password can be
	// find in the database
	passport.use(
		new localStrategy(function (username, password, done) {
			User.findOne({ username: username }, (err, user) => {
				if (err) return done(err);
				if (!user) return done(null, false);

				bcrypt.compare(password, user.password, (error, res) => {
					if (error) return done(error);
					if (res === false) return done(null, false);
					return done(null, user);
				});
			});
		})
	);

	// Check if user is authenticated with passport function
	function isLoggedIn(req, res, next) {
		if (req.isAuthenticated()) return next();
		res.redirect('/login');
	}
	// Check if user is NOT authenticated
	function isLoggedOut(req, res, next) {
		if (!req.isAuthenticated()) return next();
		res.redirect('/');
	}

	// When visiting "/" check if user is logged in
	// then render main.hbs file from /app/views folder
	app.get('/', isLoggedIn, function (req, res) {
		res.render('main', { user_name: req.user.username });
	});

	// When visiting "/login" check if user is NOT logged in
	// then render login.hbs file from /app/views folder
	app.get('/login', isLoggedOut, (req, res) => {
		res.render('login');
	});

	// Using passport function check
	app.post(
		'/login',
		passport.authenticate('local', {
			successRedirect: '/',
			failureRedirect: 'loginWrong'
		})
	);

	app.get('/loginWrong', isLoggedOut, (req, res) => {
		res.render('loginWrong');
	});

	// ### REGISTRATION PAGE ###

	// Show registration page only if user is logged out
	app.get('/register', isLoggedOut, data.register);

	// Allow to reggister only if user is logged out
	app.post('/register', isLoggedOut, data.registerPost);

	// Allow to log out only if user is logged in
	app.get('/logout', isLoggedIn, (req, res) => {
		// Call logout passport function
		req.logout();
		res.redirect('/');
	});

	// Show Add Point of Interest page only if user is logged in
	app.get('/addpoi', isLoggedIn, (req, res) => {
		res.render('addpoi');
	});

	// Call this route when click on map to add a new point of interest
	// Then display coordinates values inside form inputs
	app.get('/addpoi/:lat/:lon', isLoggedIn, data.addLatFromMap);

	// "/addpoi" -> form to create a new point of interest
	app.post('/poi', isLoggedIn, data.create);

	// Find points of interest
	app.get('/poi/:region', isLoggedIn, data.findpoi);

	// Add recomendation to a poi based on poi_id
	app.get('/recom/:Id', isLoggedIn, data.update);

	// Show reviews for a specific poi_id
	app.get('/review/:poi_id', isLoggedIn, data.findReview);

	// Add a new review (the poi_id input is hidden)
	app.post('/addreview', isLoggedIn, data.addReview);
};
