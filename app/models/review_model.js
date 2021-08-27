const mongoose = require('mongoose');
var AutoIncrement = require('mongoose-sequence')(mongoose);

const reviewSchema= new mongoose.Schema({
    Id: Number,
    poi_id:       {type: Number, required: true},
    review:        {type: String, required: true},
});

reviewSchema.plugin(AutoIncrement, {id:'seq', inc_field: 'Id'});
module.exports = mongoose.model('review', reviewSchema);