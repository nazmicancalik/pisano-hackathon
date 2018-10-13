var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

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

// Statics
app.use('/', indexRouter);


// Register API Routes
app.use('/api/users', usersRouter);
app.use('/api/mock', mockRouter);
app.use('/api/nodes', nodesRouter);

module.exports = app;
