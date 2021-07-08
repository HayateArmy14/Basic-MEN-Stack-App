require("dotenv").config();

const createError = require('http-errors');
const express = require('express');
const engine = require("ejs-mate")
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require("passport");
const User = require("./models/user");
const session = require("express-session")
const mongoose = require("mongoose")
const methodOverride = require("method-override")
const seedPosts = require("./seeds")
seedPosts();

//require Routes
const indexRouter = require('./routes/index');
const posts = require("./routes/posts")
const reviews = require("./routes/reviews")

const app = express();

//Connect to the Database 
mongoose.connect('mongodb://localhost:27017/surf-shop', {
  useNewUrlParser: true, useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to Database")
});

//use ejs-locals for all ejs templates
app.engine("ejs", engine);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
 
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride("_method"))

//Configure Passport and Sessions
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}))
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
 
// set local variables middleware
app.use((req,res,next) => {
//   req.user = {
//   "_id" : "60e3337cc3124d240423f72c",
//   "username" : "ian"
// }
res.locals.currentUser = req.user
  //set Default Page Title
  res.locals.title = "Surf Shop";
  // set succes flash meessage
  res.locals.success = req.session.success || ""; 
  delete req.session.success;
  //set error flash message
  res.locals.error = req.session.error || ""; 
  delete req.session.error;
  // continue on to next function on middleware chain
  next();
})

// Mount Routes 
app.use('/', indexRouter);
app.use("/posts", posts);
app.use("/posts/:id/reviews", reviews)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // // render the error page
  // res.status(err.status || 500);
  // res.render('error');
  console.log(err);
  req.session.error = err.message;
  res.redirect("back")

});

module.exports = app;
