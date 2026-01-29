const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');

router.get('/', mainController.home);
router.post('/submit', mainController.submitReview);
router.get("/about/keyperson", (req, res) => {
  res.render("pages/keyperson");
});
module.exports = router;
