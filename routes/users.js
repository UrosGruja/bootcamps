const express = require('express');

const {getUsers, createUser} = require('../controllers/users');
const {getUser, updateUser, deleteUser} = require('../controllers/users');

const User = require('../models/User');

const router = express.Router({ mergeParams: true});

const {protect, authorize} = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

const advancedResults = require('../middleware/advancedResults');

router.route('/')
    .get(advancedResults(User), getUsers)
    .post(createUser);

router.route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser);

module.exports = router;