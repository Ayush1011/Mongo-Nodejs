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
var passport = require('passport')
var authenticate = require('./authenticate')
const mongoose = require('mongoose');

const Dishes = require('./models/dishes');

//setiing up the url to the db
const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);
//establishing the collection to the server
connect.then((db) => {
    console.log("Connected correctly to server");
},
 (err) => { console.log(err);
 });

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//setting up the session middleware with the various options
app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));

app.use(passport.initialize())
app.use(passport.session())
app.use('/', indexRouter);
app.use('/users', usersRouter);

// authentication function
function auth (req, res, next) {
    console.log(req.session);

  if(!req.user) {
      var err = new Error('You are not authenticated!');
      err.status = 403;
      return next(err);
  		}

  else {

    
      next();
    } 
	}


app.use(auth)



// enables to server static data from the public folder
app.use(express.static(path.join(__dirname, 'public')));



// using the routes

app.use('/dishes',dishRouter);
app.use('/promotions',promoRouter);
app.use('/leaders',leaderRouter);

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