const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const usersRouter = require('./routes/users');
const scheduleRouter = require('./routes/schedule');
const lunchRouter = require('./routes/lunch');
const classroomRouter = require('./routes/classroom');
const postsRouter = require('./routes/posts');
const mapRouter = require('./routes/map');
const friendsRouter = require('./routes/friends');
const rosterRouter = require('./routes/roster');
const aboutRouter = require('./routes/about');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('*', (req, res, next) => {
  console.log(req.app.get('env'));
  next();
  // if (req.app.get('env') === 'development') {
  //  return next();
  // }
  // return req.secure ? next() : res.redirect('https://wwww.' + req.headers.host + req.url);
});

app.use('/', indexRouter);
app.use('/home', indexRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/users', usersRouter);
app.use('/schedule', scheduleRouter);
app.use('/lunch', lunchRouter);
app.use('/classroom', classroomRouter);
app.use('/announcements', postsRouter);
app.use('/map', indexRouter);
app.use('/friends', indexRouter);
app.use('/roster', rosterRouter);
app.use('/about', aboutRouter);

const mongoose = require('mongoose');
mongoose.connect(process.env.mongoDBURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  autoIndex: true,
  useFindAndModify: false
});

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
  res.render('pages/error');
});

module.exports = app;
