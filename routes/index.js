const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const controller = require('../controllers/index');

router.route('/')
  .get(auth, controller);

module.exports = router;