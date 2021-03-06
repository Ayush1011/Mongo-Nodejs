// importing node modules
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);

// using express to route the pages
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');
const uploadRouter = require('./routes/uploadRouter');

var passport = require('passport')
var authenticate = require('./authenticate')
const mongoose = require('mongoose');
var config = require('./config')
const Dishes = require('./models/dishes');

//setiing up the url to the db
const url = config.mongorl ;
const connect = mongoose.connect(url);
//establishing the collection to the server
connect.then((db) => {
    console.log("Connected correctly to server");
},
 (err) => { console.log(err);
 });

var app = express();
app.all('*', (req, res, next) => {
  if (req.secure) {
    return next();
  }
  else {
    res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
  }
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//setting up the session middleware with the various options


app.use(passport.initialize())
app.use('/', indexRouter);
app.use('/users', usersRouter);

// authentication function










// enables to server static data from the public folder
app.use(express.static(path.join(__dirname, 'public')));



// using the routes

app.use('/dishes',dishRouter);
app.use('/promotions',promoRouter);
app.use('/leaders',leaderRouter);
app.use('/imageUpload',uploadRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;