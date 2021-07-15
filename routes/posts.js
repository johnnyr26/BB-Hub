const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const controller = require('../controllers/posts');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.use(upload.single('img'));
router.route('/')
  .get(auth, controller.renderPosts)
  .post(auth, controller.uploadPosts);

module.exports = router;