//Include Node Modules
var express = require('express');
//mongoose is middleware
var mongoose = require('mongoose');
//body parser is used with req variable
var bodyParser = require('body-parser');
//passport is used for login
var passport=require('passport');

// var googleapis = require('googleapis');
var GooglePlusStrategy = require('passport-google-plus');
//used for session
var session=require('express-session');
var MongoStore=require('connect-mongo')(session);

//Require Models
var User = require('./server/models/User');
var Event = require('./server/models/Event');
var passportConf = require('./server/config/passport'); 

//Require Controllers
var userController = require('./server/controllers/user');
var eventController = require('./server/controllers/event');
var homeController = require('./server/controllers/home');
//initailaze express
var app =express();

app.set('views', __dirname + '/server/views');
app.set('view engine','jade');

//app.use is used to use middlewares
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'Any secret to encrypt the session ',
  store: new MongoStore({ url: 'mongodb://localhost/explara', autoReconnect: true })
}));


app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});


//app.use is used to use middlewares
app.use(express.static('public')); //static route handling
app.use(bodyParser.json());// assuming POST: {"name":"foo","color":"red"} <-- JSON encoding
app.use(bodyParser.urlencoded({extended:true}));// assuming POST: name=foo&color=red <-- URL encoding

//Mongoose Connection with MongoDB
mongoose.connect('mongodb://localhost/explara');
console.log('local mongodb opened');

//Routes
app.get('/', homeController.getIndex);
app.get('/add-event', eventController.getAddEvent);
app.post('/add-event', eventController.postAddEvent);
app.post('/display-event/:id', eventController.postDisplayEvent);
app.post('/add-invite/:id', eventController.postAddInvite);

app.get('/view-event', eventController.getViewEvents);
// app.post('/deleteevent/:id', eventController.postDeleteEvent);
app.get('/signup', userController.getSignUp);
app.post('/signup', userController.postSignUp);
app.post('/signin', userController.postSignIn);
app.get('/signout',userController.getSignOut);
app.get('/dashboard',userController.getDashBoard);


app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_location'] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});


//req=request =>HTTP REQUEST object
//res=response =>HTTP RESPONSE object
app.post('/auth/google/callback', passport.authenticate('google'), function(req, res) {
    // Return user back to client
    // res.send(req.user);
    console.log("howdy im inside serv.js file");
});


app.all('/auth/google/callback', passport.authenticate('google'), function(req, res) {
  req.session.googleCredentials = req.authInfo;
  // Return user profile back to client
  res.send(req.user);
});



app.listen(3000);
console.log("Express server is listening at port 3000");

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}