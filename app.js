require('dotenv').config(); // Load environment variables

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// EJS setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/layout');

// Models
const Subscriber = require('./models/subscriber');
const Contact = require('./models/contact');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
})
.then(() => {
  console.log('✅ MongoDB Connected');

  // Import routes only after DB is connected
  const productRoutes = require('./routes/products');
  const mainRoutes = require('./routes/mainRoutes');

  app.use('/products', productRoutes);
  app.use('/', mainRoutes);

  // Routes
  app.get('/about/company', (req, res) => {
    res.render('pages/company');
  });

  app.get('/contact', (req, res) => {
    res.render('pages/contact');
  });

  // POST: Subscribe
  app.post('/subscribe', async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) throw new Error("Email is required");
      const newSub = new Subscriber({ email });
      await newSub.save();
      res.redirect('/');
    } catch (err) {
      console.error("❌ Subscription error:", err.message);
      res.status(500).send("Subscription failed. Please try again later.");
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
      console.error("❌ Contact form error:", err.message);
      res.status(500).send("Contact submission failed. Please try again.");
    }
  });

  // 404 Route
  app.use((req, res) => {
    res.status(404).render('pages/404'); // Create a 404.ejs file in views/pages
  });

  // Start Server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });

})
.catch(err => {
  console.log('❌ MongoDB Error:', err.message);
});
