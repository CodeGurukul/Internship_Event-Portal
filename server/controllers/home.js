var Event = require('../models/Event');

exports.getIndex = function(req,res){
        Event.find(function(err,events){
            res.render('index',{eventList:events});
        });
}