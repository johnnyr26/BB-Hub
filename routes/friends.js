const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const controller = require('../controllers/friends');

router.route('/')
    .get(auth, controller.renderFriends)
    .post(auth, controller.updateFriends);

module.exports = router;