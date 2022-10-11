const express = require('express');

const { 
    getBootcamps, 
    getBootcamp, 
    postBootcamp, 
    putBootcamp, 
    deleteBootcamp,
    getBootcampsInRadius
} = require('../controllers/bootcamps');

const router = express.Router();

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