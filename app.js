var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

app.use('/', indexRouter);
app.use('/users', usersRouter);


//----------------Add new context-------------------------
var loginRouter = require('./routes/login');
app.use('/login', loginRouter);

var registryRouter = require('./routes/registry');
app.use('/registry', registryRouter);



var haopvRouter = require('./routes/userRoutes/haopv');
app.use('/haopv', haopvRouter);

function getRouter(usname){
  const routeParth = './routes/userRoutes/' + usname;
  let userRouter = require(routeParth);

  const getPath = '/'+ usname;
  app.use(getPath, userRouter)
}













//-----------------------------


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

/*/Add new context
var haopvRouter = require('./routes/userRoutes/haopv');
app.use('/haopv', haopvRouter);
*/









