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

const Bootcamp = require('../models/Bootcamps');
const advancedResults = require('../middleware/advancedResults');

// Include other resource router
const courseRouter = require('./courses');

const router = express.Router();

router.use('/:bootcampId/courses', courseRouter);

router
    .route('/')
    .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
    .post(postBootcamp);

router.
    route('/:id')
    .get(getBootcamp)
    .put(putBootcamp)
    .delete(deleteBootcamp);

router.
    route('/radius/:zipcode/:distance')
    .get(getBootcampsInRadius);

router.
    route('/:id/photo')
    .put(bootcampPhotoUpload);

module.exports = router;