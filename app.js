const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
require("dotenv").config()
const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');
const hbs = require('express-handlebars')
const connectDb = require('./config/connectDb')
const session = require('express-session')
const cookieParser = require('cookie-parser');
const flash = require('express-flash')


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.engine('hbs', hbs.engine({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: __dirname + '/views',
  partialsDir: __dirname + '/views/partials',
  
}))


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie:{
    maxAge:600000
  }
}));
app.use(cookieParser());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(flash())


connectDb();

app.use(express.static(__dirname + '/public'));
app.use('/admin',express.static(path.join(__dirname, 'public/adminAssets')));
app.use('/',express.static(path.join(__dirname, 'public/userAssets')));


app.use('/admin',adminRouter)
app.use('/',userRouter)
 
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

app.use('/uploads',express.static('public/adminAssets/uploads'))

module.exports = app;
