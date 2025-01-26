const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlacklistedTokenSchema = new Schema({
  token: { type: String, required: true },
  blacklistedAt: { type: Date, default: Date.now, expires: '7d' } // Token expires after 7 days
});

module.exports = mongoose.model('BlacklistedToken', BlacklistedTokenSchema);