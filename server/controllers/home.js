var Course = require('../models/Event');

exports.getIndex = function(req,res){
        Course.find(function(err,courses){
            res.render('index',{courseList:courses});
        });
}