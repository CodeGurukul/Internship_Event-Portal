var Course = require('../models/Course');

exports.getIndex = function(req,res){
        Course.find(function(err,courses){
            res.render('index',{courseList:courses});
        });
}