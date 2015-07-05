var mongoose = require('mongoose'), 
Schema = mongoose.Schema, 
ObjectId = Schema.ObjectId;

var homeSchema = new mongoose.Schema({
	firstName: String,
	lastName : String,
	email: String,
	message: String,
	phone: String
});

var Home = mongoose.model('Home',homeSchema);
module.exports = Home;