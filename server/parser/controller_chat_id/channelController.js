const mongoose = require('mongoose');

const ChannelSchema = new mongoose.Schema({
  channelId: {
    type: String,
    required: true,
    unique: true,
  },
  discussionId: {
    type: String,
    required: true,
    unique: true,
  },
  link: {
    type: String,
    required: true,
    unique: true,
  },
});

const Channel = mongoose.models.Channel || mongoose.model('Channel', ChannelSchema);

const saveChannel = async (channelId, discussionId, link) => {
  let channel = await Channel.findOne({ channelId });
  if (channel) {
    channel.discussionId = discussionId;
    channel.link = link;
  } else {
    channel = new Channel({ channelId, discussionId, link });
  }
  await channel.save();
  return channel;
};

module.exports = {
  saveChannel,
  Channel,
};
