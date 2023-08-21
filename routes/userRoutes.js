const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserController = require('../controllers/userController');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// register

router.post('/register', UserController.registerUser);
// Generate Password
router.post('/generate-password', async (req, res) => {
    const { token0, password } = req.body;

    try {
        const user = await User.findOne({ password: token0 });
        if (!user) {
            return res.status(400).json({ message: 'Invalid token' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.password = password;
        await user.save();
        res.status(200).json({ message: 'Password set successfully' });
    } catch (error) {
        console.error('Error setting password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
//Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email' });
        }

        // Compare plain text password with hashed password
        if (password !== user.password) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Logout
router.post('/logout', (req, res) => {
    // In a real-world scenario, you can clear the token from the client side
    res.status(200).json({ message: 'Logged out successfully' });
});

// dashboard route
router.get('/dashboard', authMiddleware, (req, res) => {
    // The user is authenticated and authorized to access this route
    res.status(200).json({ message: 'Access granted' });
});

module.exports = router;
