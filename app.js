var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require("dotenv").config()
var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');
const hbs = require('express-handlebars')
const connectDb = require('./config/connectDb')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.engine('hbs', hbs.engine({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: __dirname + '/views',
  partialsDir: __dirname + '/views/partials',
  
}))


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

connectDb();

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

module.exports = app;
