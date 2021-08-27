const mongoose = require('mongoose');

// Create a Schema
const dataSchema = mongoose.Schema({
	username: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	}
});

// Create the model based on the schema created above
module.exports = mongoose.model('user', dataSchema);
