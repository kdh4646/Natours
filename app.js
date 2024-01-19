const express = require('express'); //express
const morgan = require('morgan'); //3rd part middleware - logging

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

/* 1) MIDDLEWARES */
app.use(morgan('dev')); //logging
app.use(express.json());

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

/* 4) START SERVER */
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
