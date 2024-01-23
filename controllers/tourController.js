const Tour = require('../models/tourModel');

//Get All Tours
exports.getAllTours = (req, res) => {
  //1. using middleware
  console.log(req.requestTime);

  res.status(200).json({
    //JSend data specification
    status: 'success',

    //2. using middleware
    requestedAt: req.requestTime,

    //results is not JSend data specification
    // results: tours.length,

    // data: { tours },
  });
};

//Get Tour
exports.getTour = (req, res) => {
  console.log(req.params);

  //convert to number
  const id = req.params.id * 1;
  // const tour = tours.find((el) => el.id === id);

  // res.status(200).json({
  //   status: 'success',
  //   data: { tour },
  // });
};

//Create Tour
exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!',
    });
  }
};

//Update Tour
exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'sucess',
    data: {
      tour: '<Updated tour here...>',
    },
  });
};

//Delete Tour
exports.deleteTour = (req, res) => {
  //204: no content
  res.status(204).json({
    status: 'sucess',
    data: null,
  });
};
