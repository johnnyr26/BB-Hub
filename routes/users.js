const express = require('express');
const router = express.Router();

const controller = require('../controllers/users');
const auth = require('../middlewares/auth');

router.route('/:user?')
    .get(auth, controller.renderUser);

module.exports = router;