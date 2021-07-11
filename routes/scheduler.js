const express = require('express');
const router = express.Router();

const controller = require('../controllers/scheduler');
const auth = require('../middlewares/auth');

router.route('/:user?')
    .get(auth, controller.renderScheduler)
    .post(auth, controller.uploadSchedule);

module.exports = router;