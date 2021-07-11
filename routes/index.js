const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const controller = require('../controllers/index');

router.route('/')
  .get(auth, controller.renderIndex)
  .post(auth, controller.updateFriends);

module.exports = router;