var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

let User = require('./lib/User')
var db = require('./db_data/database.js')

var crypto = require('crypto');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var session = require("express-session")
var bodyParser = require("body-parser");

let sqlite3 = require('sqlite3').verbose();
let sqliteStoreFactory = require('express-session-sqlite').default;

const SqliteStore = sqliteStoreFactory(session)
// set environment variables
// process.env.NODE_ENV = 'development';

// read config file
const config = require('./config/config.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
    store: new SqliteStore({
        // Database library to use. Any library is fine as long as the API is compatible
        // with sqlite3, such as sqlite3-offline
        driver: sqlite3.Database,
        path: './db_data/main.sqlite3',
        // Session TimeToLive in milliseconds
        ttl: 31557600000, // 1 Year
        // (optional) Session id prefix. Default is no prefix.
        prefix: 'sess:',
    }),
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// app.use(app.router);


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));



app.use(bodyParser.urlencoded({extended: false}));
var indexRouter = require('./routes/index_route');
var usersRouter = require('./routes/users_route');
var canvasRouter = require('./routes/canvas_route');
var dataRouter = require('./routes/data_interaction');


app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/canvas', canvasRouter);
app.use('/data', dataRouter);


function hashPassword(password, salt) {
    var hash = crypto.createHash('sha256');
    hash.update(password);
    hash.update(salt);
    return hash.digest('hex');
}

passport.use('local', new LocalStrategy(
    {
        usernameField: "nick",
        passwordField: "password"
    },function (nick, password, done) {
    db.db.get(`SELECT salt FROM users WHERE nick = "${nick}"`, function (err, row) {
        if (err) {
            throw err;
        }
        if (!row) {
            return done(null, false);
        }
        let hash = hashPassword(password, row.salt);
        db.db.get(`SELECT nick, id FROM users WHERE nick = "${nick}" AND password = "${hash}"`, function (err, row) {
            if (err) {
                throw err;
            }
            if (!row) {
                return done(null, false);
            }
            return done(null, new User(row.id,row.nick));
        });
    });
}));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    db.db.get(`SELECT id, nick FROM users WHERE id = ${id};`, function (err, row) {
        if (err) {
            throw err;
        }
        if (!row) {
            done(null, false);
        }
        done(null, new User(row.id,row.nick));
    });
});

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
