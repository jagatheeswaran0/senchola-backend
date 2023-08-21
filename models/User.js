const mongoose = require('mongoose');



const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  gender: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  qualification: { type: String, required: true },
  degree: { type: String, required: true },
  passOutYear: { type: String, required: true },
  collegeName: { type: String, required: true },
  wantToLearn: { type: String, required: true },
  hasLaptop: { type: String, required: true },
  howDidYouKnow: { type: String, required: true },
  password: { type: String, default: null },
  token: { type: String, default: null },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
