//Mongoose stuff
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var searchSchema = new Schema({
    query: String,
    time: {type: Date, default: Date.now}
});

module.exports = mongoose.model('ImgSearch', searchSchema);