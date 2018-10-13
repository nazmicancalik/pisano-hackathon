var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var mockRouter = require('./routes/mock');
var nodesRouter = require('./routes/nodes');

var app = express();

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var mongoDB = 'mongodb://exbibyte:exbibyte2018@ds131373.mlab.com:31373/paperwork';
mongoose.connect(mongoDB);

// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;

//Get the default connection
var db = mongoose.connection;

// Statics
app.use('/', indexRouter);


// Register API Routes
app.use('/api/users', usersRouter);
app.use('/api/mock', mockRouter);
app.use('/api/nodes', nodesRouter);

module.exports = app;
