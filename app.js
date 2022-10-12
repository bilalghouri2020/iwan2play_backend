var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require("mongoose");
const dotenv = require("dotenv");
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
const openRoutes = require("./AppModule/baseRoutes/routers.open");
const closeRouteController = require("./AppModule/baseRoutes/controller");
const closeRoutes = require("./AppModule/baseRoutes/routes.close");
const multer = require('multer')
const upload = multer()

const {
  verifyUser
} = closeRouteController;



var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

dotenv.config();
mongoose.connect(process.env.DB_DEV, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// mongoose.set("useFindAndModify", false);
mongoose.connection.on("connected", () => {
  console.log("Connected To Data Base ...");
});



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(upload.any())



// app.get('/checkrouter', (req, res) => {
//   console.log("connection successful");
//   res.json({
//     message: 'ok connection'
//   })
// })

app.use(openRoutes);
app.use(
  // upload.any(),
  verifyUser,
  closeRoutes
);




app.get('/', (req, res) => {
  res.json({
    message: 'connection ok'
  })
})
// app.use('/' () => {

// });
// app.use('/users', usersRouter);








// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
