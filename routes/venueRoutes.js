const express = require('express');
const venueController = require('../controllers/venueController');
const authController = require('../controllers/authController');

const router = express.Router();

// router.param('id', venueController.checkID);

router.route('/stats').get(venueController.getVenueStats);

router
  .route('/')
  .get(authController.protect, venueController.getAllVenues)
  .post(venueController.createVenue);

router
  .route('/:id')
  .get(venueController.getVenue)
  .patch(venueController.updateVenue)
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    venueController.deleteVenue,
  );

module.exports = router;
