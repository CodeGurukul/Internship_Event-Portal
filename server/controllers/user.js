var User = require('../models/User');
var Event = require('../models/Event');
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
            Event.find(function(err,events){
            res.render('index',{eventList:events});
        });
            }

exports.getDashBoard=function(req,res){

                Event.find({
                '_id': { $in: req.user.invites}
              },function(err,events){
                if(err)
                {
                console.log(err);  
                }
                else
                {
                 res.render('dashboard',{events:events});
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
