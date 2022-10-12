const express = require('express');

const { 
    getBootcamps, 
    getBootcamp, 
    postBootcamp, 
    putBootcamp, 
    deleteBootcamp,
    getBootcampsInRadius
} = require('../controllers/bootcamps');

// Include other resource router
const courseRouter = require('./courses');

const router = express.Router();

router.use('/:bootcampId/courses', courseRouter);

router
    .route('/')
    .get(getBootcamps)
    .post(postBootcamp);

router.
    route('/:id')
    .get(getBootcamp)
    .put(putBootcamp)
    .delete(deleteBootcamp);

router.
    route('/radius/:zipcode/:distance')
    .get(getBootcampsInRadius);

module.exports = router;