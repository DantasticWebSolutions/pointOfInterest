// Call the models
const User = require('../models/user_model.js');
const pointsofinterest = require('../models/poi_model.js');
const bcrypt = require('bcrypt');
const review = require('../models/review_model.js');

exports.register = (req, res) => {
	res.render('register');
};

exports.registerPost = async (req, res) => {
	try {
		// add encyrpted password
		const new_pass = await bcrypt.hash(req.body.password, 10);
		var new_user = new User({
			username: req.body.username,
			email: req.body.email,
			password: new_pass
		});
		// console.log(req.body);
		console.log(new_user);
		// new_user.save((err, result) => {
		// 	if (err) return console.log(err);
		// });
		new_user.save().then((result) => {
			res.send({ msg: 'Data saved', message: result });
		});
		res.redirect('/login');
		console.log('Account Created successfulluy');
	} catch (err) {
		res.redirect('/register');
		console.error(`Error: ${err.message}`);
		process.exit(1);
	}
};

exports.create = async (req, res) => {
	try {
		// Check if there is data
		if (!req.body) {
			alert('Missing data, Please insert all the data required');
		} else {
			// Create a new object based on the schema defined in model
			var data = new pointsofinterest();
			// Assign values retrived from
			// <form> <input name="name">
			data.name = req.body.name;
			data.type = req.body.type;
			data.country = req.body.country;
			data.region = req.body.region;
			// Transform the value into a number
			data.lon = Number(req.body.lon);
			data.lat = Number(req.body.lat);
			data.description = req.body.description;
			data.recomendations = Number(req.body.recommendations);

			console.log(data);

			// Add the new poi to database
			await data.save(function (err, result) {
				if (err) return console.error(err);
				res.redirect('/');
			});
		}
	} catch (err) {
		res.status(400).send('Unable to save');
		console.error(err);
		process.exit(1);
	}
};

exports.addLatFromMap = (req, res) => {
	const username = req.user.username;
	const lat = req.params.lat;
	const lon = req.params.lon;

	res.render('addpoi', { user_name: username, lat: lat, lon: lon });
};

exports.findpoi = (req, res) => {
	pointsofinterest.find({ region: req.params.region }, function (err, result) {
		if (err) console.log("Couldn't retrieve data");
		// res.send(result);
		res.send(JSON.stringify(result));
		// console.log(result);
	});
};

//rest Api to increase the recommendations by user

exports.update = async (req, res) => {
	var id = Number(req.params.Id);
	console.log(id);
	await pointsofinterest
		// Update value that is already inside the database
		.updateOne({ poi_id: id }, { $inc: { recomendations: 1 } }, { new: false })
		.then((result) => {
			if (!result) {
				console.log('Error');
				return res.status(404).send();
			}
			res.send({ success: 1 });
		})
		.catch((error) => {
			console.log(error);
			res.status(500).send(error);
		});
};

exports.findReview = async (req, res) => {
	try {
		var id = parseInt(req.params.poi_id);
		console.log(id);
		await review.find({ poi_id: id }, function (err, result) {
			if (err) {
				console.log("Couldn't retrieve data");
				console.log(result);
				// If there is no reviews, display empty review and render review page
			} else if (Object.keys(result).length === 0) {
				result = [{ Id: 0, poi_id: req.params.poi_id, review: '' }];
				res.render('review', { result: result, poi_id: result[0].poi_id });
				console.log(result);
			} else {
				res.render('review', { result: result, poi_id: result[0].poi_id });
				console.log(result);
				result[0].poi_id;
			}
		});
	} catch (err) {
		res.status(400).send('Unable to find Review ');
	}
};

exports.addReview = async (req, res) => {
	try {
		var data = new review();
		data.poi_id = req.body.poi_id;
		data.review = req.body.review;
		//console.log(data);
		await data.save(function (err, doc) {
			if (err) return console.error(err);
			res.redirect('/');
		});
	} catch (err) {
		res.status(400).send('Unable to save');
		console.error(err);
		process.exit(1);
	}
};
