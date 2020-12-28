var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var mongoose = require('mongoose');

var passport = require('passport');
var JWTStrategy = require('passport-jwt').Strategy;
var ExtractJWT = require('passport-jwt').ExtractJwt;

// #################### MONGO CONNECTION ####################
var mongoDB = 'mongodb://127.0.0.1/PGDREApp'
mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

var db = mongoose.connection

db.on('error', () => {
    console.log('MongoDB connection error ... ')
})
db.once('open', () => {
    console.log('MongoDB connection successful ... ')
})

// #################### ROUTES ####################

var recursosRouter = require('./routes/recursos');
var usersRouter = require('./routes/users');
var noticiasRouter = require('./routes/noticias');

// #################### AUTHENTICATION ####################
var extractFromQS = req => {
    var token = null
    if (req.query && req.query.token) {
        token = req.query.token
    }
    return token
}

var extractFromBody = req => {
    var token = null
    if (req.body && req.body.token) {
        token = req.body.token
    }
    return token
}

passport.use(new JWTStrategy({
    secretOrKey: 'pri2020',
    jwtFromRequest: ExtractJWT.fromExtractors(
        [extractFromQS, extractFromBody]
    )
}, async (payload, done) => {
    try {
        return done(null, payload)
    } catch (error) {
        return done(error)
    }
}))

// #################### MIDDLEWARE ####################

var app = express();

app.use(passport.initialize());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// #################### ROUTES ####################
app.use('/recursos', recursosRouter);
app.use('/users', usersRouter);
app.user('/noticias', noticiasRouter);
app.user('/', noticiasRouter);

// #################### ERROR HANDLER ####################
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) { // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500).jsonp(err);
});

// ########################################
module.exports = app;