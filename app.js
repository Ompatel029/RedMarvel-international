require('dotenv').config(); // Load environment variables

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const nodemailer = require('nodemailer'); // Email sending

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

app.get('/sitemap.xml', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'sitemap.xml'));
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000
})
  .then(() => {
    console.log('MongoDB Connected');

    // Routes
    const productRoutes = require('./routes/products');
    const mainRoutes = require('./routes/mainRoutes');

    app.use('/products', productRoutes);
    app.use('/', mainRoutes);

    // Static Page Routes
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
        console.error("Subscription error:", err.message);
        res.status(500).send("Subscription failed. Please try again later.");
      }
    });

    app.post('/contact', async (req, res) => {
      try {
        const { firstname, lastname, email, phone, message } = req.body;

        const contact = new Contact({ firstname, lastname, email, phone, message });
        await contact.save();
        console.log('New contact message received');

        let transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS  
          }
        });

        let mailOptions = {
          from: `"${firstname} ${lastname}" <${email}>`,
          to: process.env.RECEIVER_EMAIL || 'info@redmarvelinternational.com',
          subject: 'New Contact Form Submission',
          html: `
            <h2>New Contact Form Message</h2>
            <p><strong>Name:</strong> ${firstname} ${lastname}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Message:</strong> ${message}</p>
          `
        };

        await transporter.sendMail(mailOptions);
        console.log('Contact form email sent');

        res.redirect('/');
      } catch (err) {
        console.error("Contact form error:", err.message);
        res.status(500).send("Contact submission failed. Please try again.");
      }
    });

    app.use((req, res) => {
      res.status(404).render('pages/404');
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

  })
  .catch(err => {
    console.error('MongoDB Error:', err.message);
  });
