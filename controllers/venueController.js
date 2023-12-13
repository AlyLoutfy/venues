const APIFeatures = require('../utils/apiFeatures');
const Venue = require('../models/venueModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllVenues = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Venue.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const venues = await features.query;

  res.status(200).json({
    status: 'success',
    results: venues.length,
    data: {
      venues,
    },
  });
});

exports.getVenue = catchAsync(async (req, res, next) => {
  const venue = await Venue.findById(req.params.id);
  if (!venue) {
    return next(new AppError('No venue found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      venue,
    },
  });
});

exports.createVenue = catchAsync(async (req, res, next) => {
  const newVenue = await Venue.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      newVenue,
    },
  });
});

exports.updateVenue = catchAsync(async (req, res, next) => {
  const venue = await Venue.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!venue) {
    return next(new AppError('No venue found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      venue,
    },
  });
});

exports.deleteVenue = catchAsync(async (req, res, next) => {
  const venue = await Venue.findByIdAndDelete(req.params.id);

  if (!venue) {
    return next(new AppError('No venue found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getVenueStats = catchAsync(async (req, res, next) => {
  const stats = await Venue.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: '$company',
        numVenues: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});
