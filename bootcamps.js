const express = require('express');

const { 
    getBootcamps, 
    getBootcamp, 
    postBootcamp, 
    putBootcamp, 
    deleteBootcamp 
} = require('./controllers/bootcamps');

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

module.exports = router;