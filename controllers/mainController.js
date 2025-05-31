const Review = require('../models/Review');

exports.home = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.render('pages/home', { reviews });
  } catch (error) {
    console.error('Error loading reviews:', error);
    res.status(500).send('Failed to load the page.');
  }
};

exports.submitReview = async (req, res) => {
  const { name, profession, rating, comment } = req.body;
  try {
    await Review.create({ name, profession, rating, comment });
    res.redirect('/');
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).send('Failed to submit review.');
  }
};
