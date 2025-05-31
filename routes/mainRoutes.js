const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');

router.get('/', mainController.home);
router.post('/submit', mainController.submitReview);

module.exports = router;
