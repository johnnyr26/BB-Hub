const express = require('express');
const router = express.Router();

const controller = require('../controllers/lunch');

router.route('/')
    .get(controller);

module.exports = router;