let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let hbs = require('express-handlebars');
let expressValidator = require('express-validator');
let expressSession = require('express-session');

let domain_url = "http://www.vincesmoviewiki.com";

let indexRouter = require('./routes/index');
let aboutRouter = require('./routes/about');

let app = express();

// view engine setup
app.engine('hbs',
    hbs({
        extname: 'hbs',
        defaultLayout: 'layouts',
        layoutsDir: __dirname + '/views/layouts'
    })
);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({secret: 'vincent', saveUninitialized: false, resave: false}));

app.use('/', indexRouter);
app.use('/about', aboutRouter);



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