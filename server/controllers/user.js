var User = require('../models/User');
var Event = require('../models/Event');
var Home = require('../models/Home');
var passport=require('passport');

exports.getSignUp = function(req,res){
        res.render('signup');
    }

exports.postSignUp = function(req,res){
          
        var user = new User(
          {
            profile:{
              name:req.body.userName,
              gender:req.body.userGender,
              location:req.body.userLocation
                    }, 
            email:req.body.userEmail, 
            password:req.body.userPassword});
            user.save();
          res.redirect('/');
        
            
}

exports.getDashBoard=function(req,res)
  {

  Event.find({'_id': { $in: req.user.invites}},function(err,events)
    {
                  if(err)
                {
                console.log(err);  
                }
                else
                {

                  Event.find({'_id': { $in: req.user.eventsCreated}},function(err,eventsCreated)
                      {
                          if(err)
                          {
                            console.log(err);             
                          }
                          else
                          { 
                              var attending=[];
                              var invites=[];
                              for(var i=0;i<events.length;i++)
                              {
                                var index=events[i].attendees.indexOf(req.user._id); 
                                if(index!=-1)
                                {
                                    attending.push(events[i]);
                                }
                                else
                                {
                                  invites.push(events[i]);            
                                } 
                              }    
                              var att=[];
                              for(var i=0;i<eventsCreated.length;i++)
                              {
                                  
                                att=att.concat(eventsCreated[i].attendees);
                              }
                              User.find({'_id': { $in: att}} ,function(err,users){
                                
                                  for(var i=0;i<eventsCreated.length;i++)
                                    {
                                      eventsCreated[i]["att"]=[];
                                      for(var j=0;j<users.length;j++)
                                      {
                                        if(eventsCreated[i].attendees.indexOf(users[j]._id)!=-1)
                                        {
                                          eventsCreated[i].att.push(users[j]);
    
                                        }
                                      }

                                    }
                                  Home.find(function(err,homes){

                                 res.render('dashboard',{invites:invites,eventsCreated:eventsCreated,attending:attending, homes:homes});
                                    
                                });





                                });  



                              

                                  
                                  
                           }
                      });

                 // shows value inside the array as wanted


                }
    });

             // shows null value why? the variable is in the scope as its declaration 


};


exports.postSignIn = function(req,res, next){
    passport.authenticate('local',function(err, user, info) {
      if (err) return next(err);
      if (!user) {
        console.log('errors');
        return res.redirect('/');
      }
      req.logIn(user, function(err) {
        if (err) return next(err);
        console.log('Success! You are logged in.');
        res.redirect(req.session.returnTo || '/');
      });
    })(req, res, next);
}

exports.getSignOut = function(req,res, next){
  req.logout();
  res.redirect('/');
}
