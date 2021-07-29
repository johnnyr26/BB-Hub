const express = require('express');
const router = express.Router();

const controller = require('../controllers/schedule');
const auth = require('../middlewares/auth');

router.route('/')
    .get(auth, controller.renderSchedule)
    .post(auth, controller.uploadSchedule);

module.exports = router;