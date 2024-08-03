const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  chatId: { type: String, required: true },
  sender: { type: String, required: true },
  userId: { type: String, required: false },
  text: { type: String, required: true },
  timestamp: { type: Date, required: true },
});

module.exports = mongoose.model('Message', MessageSchema);
