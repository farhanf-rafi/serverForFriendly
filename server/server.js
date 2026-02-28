require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const relationshipRoute = require('./routes/relationship-route');

var app = express();

// Connect to MongoDB
const connectDB = require('./config/db');
connectDB();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/api/user', usersRouter);
app.use('/api/relation', relationshipRoute);

// catch 404
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500).json({
    success: false,
    message: err.message,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `[SERVER] Running on port ${PORT} | ENV: ${process.env.NODE_ENV || 'development'}`
  );
});

module.exports = app;
