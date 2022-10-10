const ErrorResponse = require("../utils/errorResponse")
const Bootcamps = require('../models/Bootcamps');
const asyncHandler = require('../middleware/async');

// desc         Get all bootcamps
// @route       GET /api/v1/bootcamps
// @access      Public 

exports.getBootcamps = asyncHandler(async (req, res, next) => {
    try {
        const bootcamps = await Bootcamps.find();

        res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps });
    } catch (err) {
        res.status(400).json({ success: false });
    }
});

// desc         Get single bootcamp
// @route       GET /api/v1/bootcamps/:id
// access       Public 

exports.getBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamps.findById(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`Boorcamp not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({ success: true, data: bootcamp });
});

// desc         Create new bootcamp 
// @route       POST /api/v1/bootcamps
// access       Private

exports.postBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamps.create(req.body);
    res.status(201).json({ success: true, data: bootcamp });

});

// desc         Update single bootcamp
// @route       PUT /api/v1/bootcamp/:id
// access       Private

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
// access       Private

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamps.findByIdAndDelete(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`Boorcamp not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({ success: true, data: {} });
});