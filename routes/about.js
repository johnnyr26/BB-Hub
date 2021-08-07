const express = require('express');
const router = express.Router();

const controller = require('../controllers/about');

router.route('/')
  .get(controller);

module.exports = router;