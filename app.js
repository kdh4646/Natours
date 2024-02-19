const path = require('path');
const express = require('express'); //express
const morgan = require('morgan'); //3rd part middleware - logging
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

//Set template
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

/* 1) GLOBAL MIDDLEWARES */

//Serving static files
app.use(express.static(path.join(__dirname, 'public')));

//Set security HTTP headers
//app.use(helmet());

/*
  For...
  1) leaflet script
  2) axios script
  3) openstreetmap images
  Not to be blocked by the CSP of Helmet
*/
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'script-src': ["'self'", 'https://unpkg.com', 'https://*.cloudflare.com'],
      'img-src': ["'self'", 'data:', 'https://*.tile.openstreetmap.org'],
    },
  }),
);

//Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); //logging
}

//Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  mesage: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

//Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' })); //limit the data
app.use(express.urlencoded({ extended: true, limit: '10kb' })); //form submit
app.use(cookieParser());

//Data sanitization agains NoSQL query injection
app.use(mongoSanitize()); //filter out all '$' and '.' signs

//Data sanitization against XSS
app.use(xss());

//Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

//Test middleware - define middleware
app.use((req, res, next) => {
  console.log('Hello from the middleware 🖐️');
  next();
});

//Test middleware - create own middleware
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
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

//all() - All CRUD Http Methods
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
