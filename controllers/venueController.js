const Venue = require('../models/venueModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getAllVenues = factory.getAll(Venue);
exports.getVenue = factory.getOne(Venue, { path: 'reviews' });
exports.createVenue = factory.createOne(Venue);
exports.updateVenue = factory.updateOne(Venue);
exports.deleteVenue = factory.deleteOne(Venue);

exports.getVenueStats = catchAsync(async (req, res, next) => {
  const stats = await Venue.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: '$company',
        numVenues: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1 }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});
