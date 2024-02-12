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
const cacheControl = require('cache-control');
const handlebarsHelpers = require('handlebars-helpers')();

const app = express();

app.use(express.static('public', {
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

app.locals.helpers = handlebarsHelpers;
const port = process.env.PORT || '3000';
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.engine('hbs', hbs.engine({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: __dirname + '/views',
  partialsDir: __dirname + '/views/partials',
  
}));
app.use(cacheControl({ noCache: true }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

const setNoCacheHeaders = (req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next(); // Call next middleware
};

app.use(setNoCacheHeaders);
app.use(cookieParser());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(flash())


connectDb();



app.use(express.static(path.join(__dirname, 'public/userAssets')));
app.use('/admin/myOrders',express.static(path.join(__dirname, 'public/adminAssets')));
app.use('/admin',express.static(path.join(__dirname, 'public/adminAssets')));
app.use("/category",express.static(path.join(__dirname, 'public/userAssets')));
app.use("/editAddress",express.static(path.join(__dirname, 'public/userAssets')));
app.use("/productPage",express.static(path.join(__dirname, 'public/userAssets')));
app.use("/myOrders",express.static(path.join(__dirname, 'public/userAssets')));
//productPage
//myOrders


app.use('/admin',adminRouter)
app.use('/',userRouter)
 
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


//use as middleware=========
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port,()=>{
  console.log(`Server is running at http://localhost:${port}`);
});