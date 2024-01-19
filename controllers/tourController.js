const fs = require('fs');

//Read from file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

//param validation middleware
exports.checkID = (req, res, next, val) => {
  //validation
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  next();
};

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
    results: tours.length,

    data: { tours },
  });
};

//Get Tour
exports.getTour = (req, res) => {
  console.log(req.params);

  //convert to number
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
};

//Create Tour
exports.createTour = (req, res) => {
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
