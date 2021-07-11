const express = require('express');
const router = express.Router();

const controller = require('../controllers/login');

router.route('/')
  .get(controller.renderLogin)
  .post(controller.authenticate);

module.exports = router;