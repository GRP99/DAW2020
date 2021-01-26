var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
var jwt = require('jsonwebtoken')
var fs = require('fs')
var indexRouter = require('./routes/autenticar');
var mongoose = require('mongoose')
var app = express();

var mongoDB = "mongodb://127.0.0.1/myFiles";

mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

var db = mongoose.connection;

db.on("error", () => {
    console.log("MongoDB connection failed...");
});
db.once("open", () => {
    console.log("MongoDB connection successful...");
});



app.use(function (req, res, next) {
  if (req.query.token != null) {
    var publicKey = fs.readFileSync("./keys/pubkey.pem");
    jwt.verify(req.query.token,publicKey,{ algorithms: ["RS256"] },
      function (e, payload) {
        if (e) res.status(401).jsonp({ error: e });
        else {
          next();
        }
      }
    );}
  else{
    if(req.url=="/autenticarApp") next();
  }
});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
});

module.exports = app;
