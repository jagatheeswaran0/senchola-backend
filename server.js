const express = require('express');
const { connectToDatabase } = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');
const crypto = require('crypto'); 
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());
// Generate a random JWT secret
const JWT_SECRET = crypto.randomBytes(64).toString('hex');

// Set the JWT secret as an environment variable
process.env.JWT_SECRET = JWT_SECRET;


connectToDatabase();

app.use('/api', userRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
