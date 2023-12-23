const express = require('express');
const venueController = require('../controllers/venueController');
const authController = require('../controllers/authController');
const reviewRouter = require('../routes/reviewRoutes');

const router = express.Router();

// router.param('id', venueController.checkID);

router.use('/:venueId/reviews', reviewRouter);

router.route('/stats').get(venueController.getVenueStats);

router
  .route('/')
  .get(venueController.getAllVenues)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    venueController.createVenue
  );

router
  .route('/:id')
  .get(venueController.getVenue)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    venueController.updateVenue
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    venueController.deleteVenue
  );

module.exports = router;
