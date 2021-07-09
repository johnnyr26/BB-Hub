const express = require('express');
const router = express.Router();

const controller = require('../controllers/scheduler');

router.route('/')
    .get(controller.renderScheduler)
    .post(controller.uploadSchedule);

module.exports = router;