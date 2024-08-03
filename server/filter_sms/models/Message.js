// models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  chatId: String,
  text: String,
  timestamp: Date,
  // інші поля...
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
