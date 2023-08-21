const User = require('../models/User');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const dotenv = require('dotenv');
const crypto = require('crypto');
dotenv.config();



const sendWelcomeEmail = async (email, fullName, token0) => {

  const tokenLink = `${process.env.CLIENT_URL}/generate-password/${token0}`;

  // HTML template file
  const filePath = path.join(__dirname, '../email-template/welcome_email.html');
  const source = fs.readFileSync(filePath, 'utf-8');

  const template = handlebars.compile(source);

  const emailContent = template({ fullName, tokenLink});

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Welcome to our website',
    html: emailContent,
  };

  await transporter.sendMail(mailOptions);
};

const UserController = {
  registerUser: async (req, res) => {
    try {
      const {
        fullName,
        gender,
        mobile,
        email,
        address,
        city,
        state,
        qualification,
        degree,
        passOutYear,
        collegeName,
        wantToLearn,
        hasLaptop,
        howDidYouKnow,
      } = req.body;

      // Check if the email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      // Create a new user instance with the data from the request
      const newUser = new User({
        fullName,
        gender,
        mobile,
        email,
        address,
        city,
        state,
        qualification,
        degree,
        passOutYear,
        collegeName,
        wantToLearn,
        hasLaptop,
        howDidYouKnow,
      });

      newUser.password = req.body.password;

      // Save the user to the database
      await newUser.save();
      const token0 = crypto.randomBytes(20).toString('hex');
      newUser.password = token0;
      await newUser.save();

      // Send welcome email
      await sendWelcomeEmail(newUser.email, newUser.fullName, newUser.password);

      res.status(201).json({ message: 'Registration successful', user: newUser.fullName });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
};

module.exports = UserController;
