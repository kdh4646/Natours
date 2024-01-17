const fs = require('fs');

//express
const express = require('express');

//3rd party middleware - logging
const morgan = require('morgan');

const app = express();

/* 1) MIDDLEWARES */
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

//Read from file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

/* 2) ROUTE HANDLERS */
//Get All Tours
const getAllTours = (req, res) => {
  //1. using middleware
  console.log(req.requestTime);

  res.status(200).json({
    //JSend data specification
    status: 'success',

    //2. using middleware
    requestedAt: req.requestTime,

    //results is not JSend data specification
    results: tours.length,

    data: { tours },
  });
};

//Get Tour
const getTour = (req, res) => {
  console.log(req.params);

  //convert to number
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  //validation
  //if (id > tours.length)
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
};

//Create Tour
const createTour = (req, res) => {
  // console.log(req.body);

  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

//Update Tour
const updateTour = (req, res) => {
  //validation
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'sucess',
    data: {
      tour: '<Updated tour here...>',
    },
  });
};

//Delete Tour
const deleteTour = (req, res) => {
  //validation
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  //204: no content
  res.status(204).json({
    status: 'sucess',
    data: null,
  });
};

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

/* 3) ROUTES */
app.route('/api/v1/tours').get(getAllTours).post(createTour);
app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

/* 4) START SERVER */
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
