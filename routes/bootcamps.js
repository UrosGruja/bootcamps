const express = require('express');

const {
    getBootcamps,
    getBootcamp,
    postBootcamp,
    putBootcamp,
    deleteBootcamp,
    getBootcampsInRadius,
    bootcampPhotoUpload
} = require('../controllers/bootcamps');

const { protect, authorize } = require('../middleware/auth')

const Bootcamp = require('../models/Bootcamps');
const advancedResults = require('../middleware/advancedResults');

// Include other resource router
const courseRouter = require('./courses');

const router = express.Router();

router.use('/:bootcampId/courses', courseRouter);

router
    .route('/')
    .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
    .post(protect, authorize('publisher', 'admin'), postBootcamp);

router.
    route('/:id')
    .get(getBootcamp)
    .put(protect,authorize('publisher', 'admin'), putBootcamp)
    .delete(protect, authorize('publisher', 'admin'), deleteBootcamp);

router.
    route('/radius/:zipcode/:distance')
    .get(getBootcampsInRadius);

router.
    route('/:id/photo')
    .put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);

module.exports = router;