const express = require('express');
const app = express();
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/products');
app.use('/products', productRoutes);

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/nexusexim', {
  serverSelectionTimeoutMS: 5000,
})
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err));

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// EJS setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/layout');

// Models
const Subscriber = require('./models/subscriber');
const Contact = require('./models/contact');

// Routes
const mainRoutes = require('./routes/mainRoutes');
app.use('/', mainRoutes);

// POST: Subscribe
app.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) throw new Error("Email is required");
    const newSub = new Subscriber({ email });
    await newSub.save();
    res.redirect('/');
  } catch (err) {
    console.error("Subscription error:", err);
    res.redirect('/');
  }
});

// POST: Contact
app.post('/contact', async (req, res) => {
  try {
    const { firstname, lastname, email, phone, message } = req.body;
    const contact = new Contact({ firstname, lastname, email, phone, message });
    await contact.save();
    console.log('📩 New contact message received');
    res.redirect('/');
  } catch (err) {
    console.error("Contact form error:", err);
    res.redirect('/');
  }
});

// Server start
app.listen(3000, () => {
  console.log('🚀 Server running on http://localhost:3000');
});
app.get('/about/company', (req, res) => {
  res.render('pages/company');
});

app.get('/contact', (req, res) => {
  res.render('pages/contact'); // Assuming your file is at views/pages/contact.ejs
});

