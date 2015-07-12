//Include Node Modules
var express = require('express');
//mongoose is middleware
var mongoose = require('mongoose');
//body parser is used with req variable
var bodyParser = require('body-parser');
//passport is used for login
var passport=require('passport');
//nodemailer is used for sending mails
var nodemailer=require('nodemailer');

// var googleapis = require('googleapis');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
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

var multer     =       require('multer');
var done       =       false;


// for nodemailer
// create reusable transporter object using SMTP transport 
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'explara.event.invite@gmail.com', //new mail id made for the sake of project
        pass: 'aakashankitchintan' // by default emails will be sent from this id
    }
});

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
app.get('/contactus', homeController.getContactUs);
app.post('/contactus', homeController.postContactUs);
app.get('/add-event', eventController.getAddEvent);
app.post('/add-event', eventController.postAddEvent);
app.post('/join-event/:id', eventController.postJoinEvent);
app.post('/display-event/:id', eventController.postDisplayEvent);
app.get('/display-event/:id', eventController.postDisplayEvent);
app.post('/add-invite/:id', eventController.postAddInvite);
app.post('/confirm-event/:id', eventController.postConfirmEvent);
app.post('/cancel-event/:id', eventController.postCancelEvent);
app.post('/unregister-event/:id', eventController.postUnregisterEvent);
app.get('/aboutus', homeController.getAboutUs);
app.get('/view-event', eventController.getViewEvents);
app.post('/delete-event/:id', eventController.postDeleteEvent);
app.post('/delete-user/:id', userController.postDeleteUser);
app.get('/signup', userController.getSignUp);
app.post('/signup', userController.postSignUp);
app.post('/signin', userController.postSignIn);
app.get('/signout',userController.getSignOut);
app.get('/dashboard',userController.getDashBoard);
app.get('/adminDashboard',userController.getAdminDashBoard);
app.get('/deletuser-event/:eid/:uid',eventController.getDeleteUserEvent);
app.post('/delete-message/:mid',homeController.postDeleteMessage);

app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_location'] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});

app.get('/auth/google', passport.authenticate('google',  { scope:  ['profile' , 'email' , 'https://www.googleapis.com/auth/plus.login']}));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), function(req, res) {
res.redirect(req.session.returnTo || '/');
  });

app.use(multer({ dest: 'public',
 rename: function (fieldname, filename) {
    return filename+Date.now();
  },
onFileUploadStart: function (file) {
  console.log(file.originalname + ' is starting ...')
},
onFileUploadComplete: function (file) {
  console.log(file.fieldname + ' uploaded to  ' + file.path)
  done=true;
}
}));

//Dont module it giving error and anamolous behaviour
app.post('/api/photo/:id',function(req,res){
  if(done==true)
  {
    console.log(req.params.id)
    console.log(req.files.userPhoto);
          
        Event.findByIdAndUpdate(req.params.id,
          {
            
                  img:
                      {
                        fieldname: req.files.userPhoto.fieldname,
                        originalname: req.files.userPhoto.originalname,
                        name: req.files.userPhoto.name,
                        encoding: req.files.userPhoto.encoding,
                        mimetype: req.files.userPhoto.mimetype,
                        path: req.files.userPhoto.path,
                       extension: req.files.userPhoto.extension,
                        size: req.files.userPhoto.size,
                        truncated: req.files.userPhoto.truncated
                        // buffer:req.files.userPhoto.buffer
                      } 
            },
            function(err, model)
             {
              if(err)
              {
                console/log("error at server");
                res.redirect('/dashboard');
               console.log(err)
               }
               else
               {
                res.redirect('/dashboard'); 
              }
              });

  }
});

// //temop code remove after use
// var num = 5;
// var mailBody = 'Hello user, you are invited to event id :'+ num + 'bye'
// console.log(mailBody);
// //temop code remove after use



// ===================================== nodemailer code starts =====================================
// setup e-mail data with unicode symbols 
var mailOptions = {
    from: 'Explara <foo@blurdybloop.com>', // sender address 
    to: 'chintanmistry.00@gmail.com, chintanmistry.00@live.com', // list of receivers 
    subject: 'Hello this is fromm explara', // Subject line 
    text: 'Hello world this is sucessful', // plaintext body 
    html: '<b>Hello world ✔</b>' // html body 
};

// send mail with defined transport object 
/*transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
});
*/
// ====================================== nodemailer code ends ======================================


//to confirm that the abpve code runs perfectly
app.listen(3000);
console.log("Express server is listening at port 3000");  
