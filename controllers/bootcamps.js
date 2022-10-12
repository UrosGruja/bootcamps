const ErrorResponse = require("../utils/errorResponse")
const Bootcamps = require('../models/Bootcamps');
const asyncHandler = require('../middleware/async');
const geocoder = require("../utils/geocoder");
const { query } = require("express");

// @desc        Get all bootcamps
// @route       GET /api/v1/bootcamps
// @access      Public 

exports.getBootcamps = asyncHandler(async (req, res, next) => {

    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    //Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    //Create operators { $gt, $gte, $lt, $lts, $in } 
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    query = Bootcamps.find(JSON.parse(queryStr)).populate('courses');

    // Select fields 
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    // Sort 
    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    }else{
        query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 1;
    const startIndex = (page - 1) * limit;
    const lastIndex = page * limit;
    const total = await Bootcamps.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Pagination result
    const pagination = {};

    if(lastIndex < total){
        pagination.next = {
            page: page + 1,
            limit
        }
    }
    if(startIndex > 0){
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    //Executing query
    const bootcamps = await query;

    res.status(200).json({ success: true, count: bootcamps.length, pagination, data: bootcamps });
});

// @desc         Get single bootcamp
// @route       GET /api/v1/bootcamps/:id
// @access       Public 

exports.getBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamps.findById(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`Boorcamp not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({ success: true, data: bootcamp });
});

// @desc         Create new bootcamp 
// @route       POST /api/v1/bootcamps
// @access       Private

exports.postBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamps.create(req.body);
    res.status(201).json({ success: true, data: bootcamp });

});

// @desc         Update single bootcamp
// @route       PUT /api/v1/bootcamp/:id
// @access       Private

exports.putBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamps.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!bootcamp) {
        // return res.status(400).json({ success: false });
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({ success: true, data: bootcamp });
});

// desc         Delete single bootcamp 
// @route       DELETE /api/v1/bootcamp/:id
// @access       Private

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamps.findById(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`Boorcamp not found with id of ${req.params.id}`, 404));
    }
    bootcamp.remove();

    res.status(200).json({ success: true, data: {} });
});

// @desc        Fet bootcamps whitin a radius 
// @route       GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access      Private

exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;

    // Get lat/lng from geocoder

    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;


    // Calc radius using radians
    // Divide dist by radius of Earth
    // Earth Radius = 3,963 mi / 6,378 km

    const radius = distance / 6378;

    const bootcamp = await Bootcamps.find({
        location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    });

    res.status(200).json({
        success: true,
        count: bootcamp.length,
        data: bootcamp
    });

});