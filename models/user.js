const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile: {
    firstName: { type: String },
    lastName: { type: String },
    bio: { type: String },
    location: { type: String },
    phoneNumber: { type: String }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);