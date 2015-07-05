var Event = require('../models/Event');
var Home = require('../models/Home');
var contactAck = null;
exports.getIndex = function(req,res){
        Event.find(function(err,events){

             res.render('index',{events:events});
        });
}
exports.getContactUs = function(req,res){
        

             res.render('contactus');
}
exports.postContactUs = function(req, res){
	var contactAck = "your message has been sent"
	var msg = new Home({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		phone: req.body.phone,
		message: req.body.message
	});
	msg.save(function(err){
		res.redirect('/');
	});

}
exports.getAboutUs = function(req,res){
        

             res.render('aboutus');
}