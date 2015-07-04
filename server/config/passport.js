var User = require('../models/User');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy =require('passport-facebook').Strategy;
var googleapis = require('googleapis');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// var googleapis = require('googleapis');  

var facebook= {
  clientID: '1629714087269294  ',
  clientSecret: '41c29af8d503b89c6d5ef2da2686ed79',
  callbackURL: '/auth/facebook/callback',
  passReqToCallback: true
};
var google ={
    clientID: '374775521102-ofq7hns0al7apg0adidsf5iir2gfqr33.apps.googleusercontent.com',
    clientSecret: 'sSx2YTPZHLzDCip0omqXwxsu',
    callbackURL: "http://localhost:3000/auth/google/callback"
  };




//When passport is created, this says what as to be stored with regards to the user
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

//Invoked by passport.session
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({usernameField:'email'},function(email, password, done) {
  email = email.toLowerCase();
  User.findOne({ email: email }, function(err, user) {
    if (!user) return done(null, false, { message: 'Email ' + email + ' not found'});
    user.comparePassword(password, function(err, isMatch) {
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Invalid email or password.' });
      }
    });
  });
}));



/**
 * Sign in with Facebook.
 */
passport.use(new FacebookStrategy(facebook, function(req, accessToken, refreshToken, profile, done) {
  if (req.user) {
    User.findOne({ facebook: profile.id }, function(err, existingUser) {
      if (existingUser) {
        console.log('There is already a Facebook account that belongs to you. Sign in with that account or delete it, then link it with your current account.' );
        done(err);
      } else {
        User.findById(req.user.id, function(err, user) {
          user.facebook = profile.id;
          user.tokens.push({ kind: 'facebook', accessToken: accessToken });
          user.profile.name = user.profile.name || profile.displayName;
          user.profile.gender = user.profile.gender || profile._json.gender;
          user.profile.picture = user.profile.picture || 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
          user.invites=[];
          user.save(function(err) {
            console.log('Facebook account has been linked.');
            done(err, user);
          });
        });
      }
    });
  } else {
    User.findOne({ facebook: profile.id }, function(err, existingUser) {
      if (existingUser) return done(null, existingUser);
      User.findOne({ email: profile._json.email }, function(err, existingEmailUser) {
        if (existingEmailUser) {
           console.log('There is already an account using this email address. Sign in to that account and link it with Facebook manually from Account Settings.' );
          done(err);
        } else {
          var user = new User();
          user.email = profile._json.email;
          user.facebook = profile.id;
          user.tokens.push({ kind: 'facebook', accessToken: accessToken });
          user.profile.name = profile.displayName;
          user.profile.gender = profile._json.gender;
          user.profile.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
          user.profile.location = (profile._json.location) ? profile._json.location.name : '';
          user.save(function(err) {
            done(err, user);
          });
        }
      });
    });
  }
}));



/*Sign in using google pluss*/

/** Implemented google login..Check with Ui **/
passport.use(new GoogleStrategy(google, function(req, accessToken, refreshToken, profile, done) {
  if (req.user) {
    User.findOne({ google: profile.id }, function(err, existingUser) {
      if (existingUser) {
        console.log('There is already a Google+ account that belongs to you. Sign in with that account or delete it, then link it with your current account.' );
        done(err);
      } else {
        User.findById(req.user.id, function(err, user) {
          console.log()
          user.google = profile.id;
          user.tokens.push({ kind: 'google', accessToken: accessToken });
          user.profile.name = user.profile.name || profile.displayName;
          user.profile.gender = user.profile.gender || profile._json.gender;
          // user.profile.picture = user.profile.picture || 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
          user.invites=[];
          user.save(function(err) {
            console.log('Google account has been linked.');
            done(err, user);          
          });
        });
      }
    });
  } else {
    User.findOne({ google: profile.id }, function(err, existingUser) {
      if (existingUser) return done(null, existingUser);
      User.findOne({ email: profile._json.email }, function(err, existingEmailUser) {
        if (existingEmailUser) {
           console.log('There is already an account using this email address. Sign in to that account and link it with Google manually from Account Settings.' );
          done(err);
        } else {
          var user = new User();
          user.email = profile._json.email;
          user.google = profile.id;
          user.tokens.push({ kind: 'google', accessToken: accessToken });
          user.profile.name = profile.displayName;
          user.profile.gender = profile._json.gender;
          // user.profile.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
          user.profile.location = (profile._json.location) ? profile._json.location.name : '';
          user.save(function(err) {
            done(err, user);
          });
        }
      });
    });
  }
}));


/**
 * Login Required middleware.
 */
exports.isAuthenticated = function(req, res, next) {
if(req.isAuthenticated()) return next();
  res.redirect('/');
}
