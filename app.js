var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// set environment variables
// process.env.NODE_ENV = 'development';

// read config file
const config = require('./config/config.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



var indexRouter = require('./routes/index_route');
var usersRouter = require('./routes/users_route');
var canvasRouter = require('./routes/canvas_route');

var dataRouter = require('./routes/data_interaction');


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/canvas', canvasRouter);

app.use('/data', dataRouter);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    if ((req.app.get('env') === 'development') || (req.app.get('env') === 'testing')) {
        res.locals.error = err;
    } else {
        res.locals.error = {};
    }

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
