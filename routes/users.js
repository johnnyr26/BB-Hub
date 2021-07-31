const express = require('express');
const router = express.Router();

const controller = require('../controllers/users');
const auth = require('../middlewares/auth');

router.route('/:user?')
    .get(auth, controller.renderUser)
    .post(auth, controller.editProfile);

module.exports = router;