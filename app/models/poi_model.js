const mongoose = require('mongoose');
var AutoIncrement = require('mongoose-sequence')(mongoose);

const dataSchema = new mongoose.Schema({
	poi_id: Number,
	name: { type: String, required: true },
	type: { type: String, required: true },
	country: { type: String, required: true },
	region: { type: String, required: true },
	lat: { type: Number, required: true },
	lon: { type: Number, required: true },
	description: { type: String, required: true },
	recomendations: { type: Number, required: true }
});

dataSchema.plugin(AutoIncrement, { id: 'order_seq', inc_field: 'poi_id' });
module.exports = mongoose.model('pointsofinterest', dataSchema);
