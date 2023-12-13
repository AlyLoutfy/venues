const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'A Venue must have a Name'],
    minlength: [3, 'Venue name must contain more than 3 characters'],
    maxlength: [30, 'Venue name must contain less than 30 characters'],
  },
  company: {
    type: String,
    trim: true,
  },
  contact: {
    type: String,
    required: [true, 'A Venue must have a Contact Number'],
  },
  minCapacity: {
    type: Number,
  },
  maxCapacity: {
    type: Number,
    required: [true, 'A Venue must have a Maximum Guests Capacity'],
  },
  price: {
    type: Number,
    validate: {
      validator: function () {
        return this.price || this.pricePerGuest;
      },
      message: 'At least one of Price or Price Per Guest must be specified',
    },
  },
  pricePerGuest: {
    type: Number,
    validate: {
      validator: function () {
        return this.price || this.pricePerGuest;
      },
      message: 'At least one of Price or Price Per Guest must be specified',
    },
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function (val) {
        return val < this.price;
      },
      message: 'Discount price ({VALUE}) should be lower than regular price',
    },
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0'],
  },
  ratingsQuantity: {
    type: Number,
  },
  summary: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'A Venue must have a cover image'],
  },
  images: [String],
  bookedDates: [Date],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

venueSchema.pre('validate', function (next) {
  if (!this.price && !this.pricePerGuest) {
    const err = new Error();
    err.message = 'At least one of Price or PricePerGuest must be provided';
    next(err);
  } else {
    next();
  }
});

const Venue = mongoose.model('Venue', venueSchema);

module.exports = Venue;
