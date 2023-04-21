const express = require('express');
const mongoose = require('mongoose');
const body_parser = require('body-parser');
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");



const app = express();

app.set('view engine', 'ejs');
app.use(body_parser.urlencoded({
  extended:true
}));

app.use(express.static("public"));

app.use(session({
  secret: "secret token string",
  resave: false,
  saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://127.0.0.1/test', {useNewUrlParser: true})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });


const userSchema = new mongoose.Schema({
  username: String ,
  password: String },
);

const detailsSchema = new mongoose.Schema({
  username: String,
  about_me: String,
  Instagram: String,
  Facebook: String,
  LinkedIn: String,
  GitHub: String,
  Twitter: String,
  Website:String,


  App_Development: Boolean,
  Web_Development: Boolean,
  Game_Development: Boolean,
  Data_Structures: Boolean,
  Programming: Boolean,
  Machine_Learning: Boolean,
  Data_Science: Boolean,
  Others: Boolean,

  Primary: Boolean,
  Secondary: Boolean,
  Higher_Secondary: Boolean,
  Graduation: Boolean,
  Post_Graduation: Boolean,

  Schooling: Boolean,
  CollegeStudent: Boolean,
  Teaching: Boolean,
  Job: Boolean,
  Freelancing: Boolean,
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.json());

const Details = mongoose.model('Details', detailsSchema);

app.get('/', function(req, res){
  res.render('home');
});

app.get('/login', function(req, res){
  res.render("login");
});

app.get('/register', function(req, res){
  res.render('register');
});

app.get('/secrets', function(req, res){
if (req.isAuthenticated()){
  res.render('secrets');
} else {
  res.redirect("/login");
}
});


app.post('/register', function(req, res){

User.register({username: req.body.username}, req.body.password, function(err, user){
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else{
      passport.authenticate("local")(req, res, function(){
        res.redirect('/secrets');
      });
    }
  });

});


app.post('/login', function(req, res){

  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, function(err){
    if (err){
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function(){
        res.redirect("/secrets");
      });
    }
  })

});

app.get('/logout', function(req, res){
  req.logout(function(err) {
  if (err) { return next(err); }

  res.redirect('/');
});

});


app.listen(3000, function(){
  console.log("Server started on port 3000");
});
