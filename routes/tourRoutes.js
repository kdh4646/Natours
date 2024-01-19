const express = require('express');
const fs = require('fs');

//Read from file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

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

const router = express.Router(); //middleware

router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
