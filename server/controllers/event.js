var Event = require('../models/Event');
var User = require('../models/User');
exports.getAddEvent = function(req,res){
        if(req.user)
        {
              res.render('add-event');
        }
        else
        {
            res.redirect('/');
        }

    }

exports.postAddEvent = function(req,res){
        //Create a event
        // var course = new Course ({name: req.body.courseName, featured:featured, published:req.body.date});
        var eve = new Event({organizerId:req.user._id,
            organizerEmail:req.user.email,
            attendees:[(req.user._id)],
            profile:{
                    title:req.body.eventName,
                    location:req.body.eventLocation,
                    startdate:req.body.eventStartDate,
                    enddate:req.body.eventEndDate,
                    time:req.body.eventStartTime,
                   duration:req.body.eventDuration,
                desc:req.body.eventDescription,
                category:req.body.eventCategory
    
            }});

        // changing account type
           User.update({ _id:req.user._id }, { type: 'eventAdmin' }, function (err, raw) {
      if (err) return handleError(err);
      console.log('The raw response from Mongo was ', raw);
    });

        //The Magic!
        eve.save(function(err){
        Event.find(function(err,events){
            res.render('view-event',{event:events});
        });
        });

    }

exports.getViewEvents = function(req,res){

        Event.find(function(err,events){
            res.render('view-event',{event:events});
        });

    }

exports.postDeleteCourse = function(req,res){
        Course.remove({ _id:req.params.id }, function (err) {
            Course.find(function(err,courses){
            res.render('view-course',{courses:courses});
        });
    });
}

exports.postAddInvite = function(req,res){
        User.find({email:req.body.eventInvite},function(err,user){
            User.findByIdAndUpdate(user[0]._id,{$push: {"invites": req.params.id}},
            function(err, model)
             {
                
            });
        });
    }

exports.postDisplayEvent = function(req,res){
        Event.find({ _id:req.params.id },function(err,eve){
            res.render('displayevent',{eve:eve});
        });
}