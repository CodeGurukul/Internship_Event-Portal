var Event = require('../models/Event');

exports.getIndex = function(req,res){
        Event.find(function(err,events){

             res.render('index',{events:events});
        });
}
exports.getContactUs = function(req,res){
        

             res.render('contactus');

}
exports.getAboutUs = function(req,res){
        

             res.render('aboutus');
}