const express = require('express'); //express
const morgan = require('morgan'); //3rd part middleware - logging
const rateLimit = require('express-rate-limit');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

/* 1) GLOBAL MIDDLEWARES */

//works only when envrionment is development ex) to skip log-in
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); //logging
}

//limit requests from one IP for security
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  mesage: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

app.use(express.json());
app.use(express.static(`${__dirname}/public`)); //for static files

//define middleware
app.use((req, res, next) => {
  console.log('Hello from the middleware 🖐️');
  next();
});

//create own middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

/* 2) ROUTE HANDLERS */
// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

/* 3) ROUTES */
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//all() - All CRUD Http Methods
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
