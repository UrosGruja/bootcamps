const express = require('express');

const { getCourses, postCourse } = require('../controllers/courses');
const { 
    getCourse,
    putCourse,
    deleteCourse
} = require('../controllers/courses');

const Course = require('../models/Course');
const advancedResults = require('../middleware/advancedResults');

const router = express.Router({ mergeParams: true });

router.route('/')
    .get(advancedResults(Course, {
        path: 'bootcamp',
        select: 'name description'
    }), getCourses)
    .post(postCourse);

router.route('/:id')
    .get(getCourse)
    .put(putCourse)
    .delete(deleteCourse);

module.exports = router;   