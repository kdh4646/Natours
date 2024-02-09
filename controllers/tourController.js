const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

//Alias Tour - middleware
exports.aliasTopTour = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

//Tour Stats
exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' }, //group by
        numTours: { $sum: 1 }, //count + 1
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: {
        avgPrice: 1, //use names based on results from $group, 1 is for asc order
      },
    },
    // {
    //   $match: { _id: { $ne: 'EASY' } }, //ne is not equal to
    // },
  ]);

  res.status(200).json({
    status: 'success',
    data: { stats },
  });
});

//Monthly Plan
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates', //consist separate elements from grouped data
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' }, //return results in array that corresponds to given condition
      },
    },
    { $addFields: { month: '$_id' } }, //add field based on given data
    { $project: { _id: 0 } }, //0 for invisible, 1 for visible
    { $sort: { numTourStarts: -1 } }, //-1 for dsc order
    { $limit: 12 },
  ]);

  res.status(200).json({
    status: 'success',
    data: { plan },
  });
});

//Get All Tours
exports.getAllTours = factory.getAll(Tour);

//Get Tour
exports.getTour = factory.getOne(Tour, { path: 'reviews' });

//Create Tour
exports.createTour = factory.createOne(Tour);

//Update Tour
exports.updateTour = factory.updateOne(Tour);

//Delete Tour
exports.deleteTour = factory.deleteOne(Tour);
