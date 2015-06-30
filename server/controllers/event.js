var Event = require('../models/Event');

exports.getAddEvent = function(req,res){
        if(req.user)
        {
            if(req.user.type=="eventadmin")
            {
              res.render('add-course');
            }
            else
            {
                res.send("You are not an Admin");
            }
        }
        else
        {
            res.redirect('/');
        }

    }

exports.postAddEvent = function(req,res){
        if(req.body.featuredName)
            var featured = true;
        //Create a new course
        var course = new Course ({name: req.body.courseName, featured:featured, published:req.body.date});
        //The Magic!
        course.save(function(err){
                Course.find(function(err,courses){
            res.render('view-course',{courses:courses});
        });
        });

    }

exports.getViewEvents = function(req,res){

        Event.find(function(err,events){
            res.render('view-course',{courses:events});
        });

    }

exports.postDeleteCourse = function(req,res){
        Course.remove({ _id:req.params.id }, function (err) {
            Course.find(function(err,courses){
            res.render('view-course',{courses:courses});
        });
    });
}