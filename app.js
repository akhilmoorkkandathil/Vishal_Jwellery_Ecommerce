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
const session = require('express-session')
const multer= require('multer')
const flash = require('express-flash')

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

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie:{
    maxAge:60000
  }
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
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

app.use('/uploads',express.static('public/adminAssts/uploads'))

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
  }
});
const upload =multer({storage:storage})

app.post('/your-upload-route', upload.array('files'), (req, res) => {
  console.log(req.files);
});

module.exports = app;
