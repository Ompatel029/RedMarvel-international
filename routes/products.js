const express = require('express');
const router = express.Router();

router.get('/freeze-dried', (req, res) => {
  res.render('products/freeze-dried');
});

router.get('/ceramics-stones', (req, res) => {
  res.render('products/ceramics-stones');
});

router.get('/dehydrate', (req, res) => {
  res.render('products/dehydrate');
});

router.get('/ayurvedic', (req, res) => {
  res.render('products/ayurvedic');
});

router.get('/chemicals', (req, res) => {
  res.render('products/chemicals');
});

router.get('/leather', (req, res) => {
  res.render('products/leather');
});

router.get('/handicraft', (req, res) => {
  res.render('products/handicraft');
});

router.get('/luxurious', (req, res) => {
  res.render('products/luxurious');
});

router.get('/honey', (req, res) => {
  res.render('products/honey');
});

router.get('/mix-vegetables', (req, res) => {
  res.render('products/mix-vegetables');
});

router.get('/mix-fruits', (req, res) => {
  res.render('products/mix-fruits');
});

router.get('/spices', (req, res) => {
  res.render('products/spices');
});

router.get('/frozen', (req, res) => {
  res.render('products/frozen');
});

router.get('/dryfruits', (req, res) => {
  res.render('products/dryfruits');
});

router.get('/mushroom', (req, res) => {
  res.render('products/mushroom');
});
router.get('/medicine', (req, res) => {
  res.render('products/mushroom');
});

module.exports = router;
