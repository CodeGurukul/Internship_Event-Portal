//nodemailer is used for sending mails
var nodemailer=require('nodemailer');
var hostName = require('os').hostname();
var Event = require('../models/Event');
var User = require('../models/User');

// for nodemailer
// create reusable transporter object using SMTP transport 
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'explara.event.invite@gmail.com', //new mail id made for the sake of project
        pass: 'aakashankitchintan' // by default emails will be sent from this id
    }
});

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
            img:{
                name: "defaultevent.png"
            },

            profile:{
                    title:req.body.eventName,
                    location:req.body.eventLocation,
                    startdate:req.body.eventStartDate,
                    enddate:req.body.eventEndDate,
                    time:req.body.eventStartTime,
                    duration:req.body.eventDuration,
                    desc:req.body.eventDescription,
                    category:req.body.eventCategory,
                    privateEvent:req.body.privateEvent
            }});

            //The Magic!
        eve.save(function(err)
        {
                   if(req.user.type!='admin')
                {
                     User.findByIdAndUpdate(req.user._id,{$push: {"eventsCreated": eve._id}},
                    function(err, model)
                     {
                         res.redirect('/view-event');
                    });
                 }
                 else
                 {
                   User.findByIdAndUpdate(req.user._id,{$push: {"eventsCreated": eve._id}},
                    function(err, model)
                     {
                         res.redirect('/view-event');
                    }); 
                 }
        });     
        
    }
    exports.postJoinEvent=function(req,res)
    {
         User.findByIdAndUpdate(req.user._id,{$push: {"invites": req.params.id}},
            function(err, model)
             {
                Event.findByIdAndUpdate(req.params.id,{$push: {"attendees": req.user._id}},
                function(err, model)
                 {
                    res.redirect('/dashboard'); 
                });
            }) ;  
        }

exports.getViewEvents = function(req,res){

        Event.find(function(err,events){
            res.render('view-event',{event:events});
        });

    }


exports.postAddInvite = function(req,res){
    var index =req.user.eventsCreated.indexOf(req.params.id)
            if(index!=-1)
            {       
                Event.find({_id:req.params.id},function(err,events)
                    {
                        User.find({email:req.body.eventInvite},function(err,user){
                            if(user[0])
                            {
                                // setup e-mail data with unicode symbols 
                                var htmlMailBody = 
                                '<h3>Invitation to "'
                                 + events[0].profile.title + '"</h3> <p>Hi there, you have an Invitation for an event sent from explara .<br />signin to <a href="'+hostName+':3000">explara</a> to know more.</p>';
                                var textMailBody = 'Hello ' + user[0].profile.name + ', you are invited to event :' + events[0].profile.title + 'from explara';
                                var mailOptions = 
                                {
                                    from: 'Explara <explara.event.invite@gmail.com>', // sender address 
                                    to: req.body.eventInvite, // list of receivers 
                                    subject: 'Invitation ', // Subject line 
                                    text: textMailBody, // plaintext body alt for html 
                                    html: htmlMailBody,
                                };

                                // send mail with defined transport object 
                                transporter.sendMail(mailOptions, function(error, info){
                                    if(error){
                                        return console.log(error);
                                    }
                                    console.log('Message sent: ' + info.response);
                                });
                                
                                User.findByIdAndUpdate(user[0]._id,{$push: {"invites": req.params.id}},
                                function(err, model)
                                 {
                                    res.redirect('/dashboard');
                                });
                            }
                            else
                            {
                                var htmlMailBody = 
                                '<h3>Invitation to "'
                                 + events[0].profile.title + '"</h3> <p>Hi there, you have an Invitation for an event sent from explara .<br />signin to <a href="'+hostName+':3000">explara</a> to know more.</p>';
                                var textMailBody = 'Hello , you are invited to event :' + events[0].profile.title + 'from explara';
                                var mailOptions = 
                                {
                                    from: 'Explara <explara.event.invite@gmail.com>', // sender address 
                                    to: req.body.eventInvite, // list of receivers 
                                    subject: 'Invitation ', // Subject line 
                                    text: textMailBody, // plaintext body alt for html 
                                    html: htmlMailBody,
                                };

                                // send mail with defined transport object 
                                transporter.sendMail(mailOptions, function(error, info){
                                    if(error){
                                        return console.log(error);
                                    }
                                    console.log('Message sent: ' + info.response);
                                });
                                
                                console.log('User not found');
                                res.redirect('/dashboard');
                            }



                        });
                    });
            }
            else
            {
                console.log("Not Authorized to Invite");
                res.redirect('/view-event');
            }

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
exports.getDeleteUserEvent=function(req,res)
{
    Event.findByIdAndUpdate(req.params.eid,{$pull: {"attendees":req.params.uid}},
                function(err, model)
                 {
                   
                        User.findByIdAndUpdate(req.params.uid,{$pull: {"invites": req.params.eid},$pull: {"eventsCreated": req.params.eid}},
                            function(err, model)
                            {
                                res.redirect('/adminDashboard'); 
                            });

                });  
}
