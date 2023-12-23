const mongoose = require('mongoose');
const Venue = require('./venueModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    venue: {
      type: mongoose.Schema.ObjectId,
      ref: 'Venue',
      required: [true, 'Review must belong to a Venue.']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'venue',
  //   select: 'name'
  // }).populate({
  //   path: 'user',
  //   select: 'name'
  // });

  this.populate({
    path: 'user',
    select: 'name'
  });

  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
