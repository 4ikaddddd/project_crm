const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
    unique: true,
  },
  link: {
    type: String,
    required: true,
  },
});

const Chat = mongoose.model('Chat', ChatSchema);

const saveChat = async (chatId, link) => {
  let chat = await Chat.findOne({ chatId });
  if (!chat) {
    chat = new Chat({ chatId, link });
    await chat.save();
  }
  return chat;
};

module.exports = {
  saveChat,
  Chat,
};