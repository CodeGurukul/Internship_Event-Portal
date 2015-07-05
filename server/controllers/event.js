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
            status:false,
            profile:{
                    title:req.body.eventName,
                    location:req.body.eventLocation,
                    startdate:req.body.eventStartDate,
                    enddate:req.body.eventEndDate,
                    time:req.body.eventStartTime,
                    duration:req.body.eventDuration,
                    desc:req.body.eventDescription,
                    category:req.body.eventCategory,
                    img: file.path
            }});

            //The Magic!
        eve.save(function(err)
        {

             User.findByIdAndUpdate(req.user._id,{$push: {"eventsCreated": eve._id},type:'eventAdmin'},
            function(err, model)
             {
                 res.redirect('/view-event');
            });
       
        });     
        
    }

exports.getViewEvents = function(req,res){

        Event.find(function(err,events){
            res.render('view-event',{event:events});
        });

    }


exports.postAddInvite = function(req,res){
    var index =req.user.eventsCreated.indexOf(req.params.id)
    console.log(index);
            if(index!=-1)
             {       
                console.log(index);
                User.find({email:req.body.eventInvite},function(err,user){
                    if(user[0])
                    {
                        User.findByIdAndUpdate(user[0]._id,{$push: {"invites": req.params.id}},
                        function(err, model)
                         {
                            res.redirect('/view-event');
                        });
                    }
                    else
                    {
                        console.log('User not found');
                        res.redirect('/view-event');
                    }



                });
            }
            else
            {
                console.log("Not Authorized to Invite");
                res.redirect('/view-event');
            }

    }

exports.postConfirmEvent = function(req,res){
        
        // console.log("hkau na=asdjgAJKS");
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
            console.log(eve);
            res.render('displayevent',{events:eve});
        });
}
exports.postCancelEvent = function(req,res){
       Event.findByIdAndUpdate(req.params.id,{"status": true},
                function(err, model)
                 {
                    res.redirect('/dashboard'); 
                });
   }
        
exports.postUnregisterEvent= function(req,res){
       Event.findByIdAndUpdate(req.params.id,{$pull: {"attendees":req.user._id}},
                function(err, model)
                 {
                   
                        User.findByIdAndUpdate(req.user._id,{$pull: {"invites": req.params.id},$pull: {"eventsCreated": req.params.id}},
                            function(err, model)
                            {
                                res.redirect('/dashboard'); 
                            });

                });      
}


exports.postDeleteEvent=function(req,res)
{
    
    Event.remove({ _id:req.params.id }, function (err) {

            res.redirect('/view-event');
        });

}


