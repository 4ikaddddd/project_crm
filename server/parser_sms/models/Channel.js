const mongoose = require('mongoose');

const ChannelSchema = new mongoose.Schema({
  channelId: { type: String, required: true, unique: true },
  discussionId: { type: String, required: true, unique: true },
  link: { type: String, required: true }
});

module.exports = mongoose.model('Channel', ChannelSchema);
