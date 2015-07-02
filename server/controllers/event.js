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

            //The Magic!
        eve.save(function(err)
        {

             User.findByIdAndUpdate(req.user._id,{$push: {"eventsCreated": eve._id},type:'eventAdmin'},
            function(err, model)
             {
                 Event.find(function(err,events)
                 {
                    res.render('view-event',{event:events});
                });
            });
       
        });     
        
    }

exports.getViewEvents = function(req,res){

        Event.find(function(err,events){
            res.render('view-event',{event:events});
        });

    }


exports.postAddInvite = function(req,res){
        User.find({email:req.body.eventInvite},function(err,user){
            User.findByIdAndUpdate(user[0]._id,{$push: {"invites": req.params.id}},
            function(err, model)
             {
                Event.find(function(err,events)
                 {
                    res.render('view-event',{event:events});
                });

            });
        });
    }
exports.postConfirmEvent = function(req,res){
        
        if(req.body.options=='confirm')
        {
            Event.findByIdAndUpdate(req.params.id,{$push: {"attendees": req.user._id}},
                function(err, model)
                 {
                    res.redirect('/dashboard'); 
                });
           
        }
        
        else if (req.body.options=='reject')
        {
           
            User.findByIdAndUpdate(req.user._id,{$pull: {"invites": req.params.id}},
                function(err, model)
                 {
                    res.redirect('/dashboard'); 
                });

        }          

    }






exports.postDisplayEvent = function(req,res){
        Event.find({ _id:req.params.id },function(err,eve){
            res.render('displayevent',{eve:eve});
        });
}
exports.postCancelEvent = function(req,res){
       Event.findByIdAndUpdate(req.params.id,{ profile:{"status": "Cancel"}},
                function(err, model)
                 {
                    res.redirect('/dashboard'); 
                });
   }
        
exports.postUnregisterEvent= function(req,res){
       Event.findByIdAndUpdate(req.params.id,{$pull: {"attendees":req.user._id}},
                function(err, model)
                 {
                   
                        User.findByIdAndUpdate(req.user._id,{$pull: {"invites": req.params.id}},
                            function(err, model)
                            {
                                res.redirect('/dashboard'); 
                            });

                });

       
        
}


