const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const { NewMessage } = require('telegram/events');
const { apiId, apiHash, sessionString } = require('../auth/login');
const Message = require('./models/Message');
const { Channel } = require('../parser/controller_chat_id/channelController');
const { Chat } = require('../parser/controller_chat_id/chatController');

const client = new TelegramClient(new StringSession(sessionString), apiId, apiHash, { connectionRetries: 5 });

const connectClient = async () => {
  if (!client.connected) {
    await client.connect();
  }
};

let chatAndChannelIds = []; // Глобальный список ID для доступа из разных функций

const updateChatAndChannelIds = async () => {
  const channels = await Channel.find({});
  const chats = await Chat.find({});
  chatAndChannelIds = [
    ...channels.map(channel => BigInt(channel.discussionId)),
    ...chats.map(chat => BigInt(chat.chatId))
  ];
  console.log('Updated chat and channel IDs:', chatAndChannelIds);
};

const startParsingMessages = async () => {
  await connectClient();
  await updateChatAndChannelIds(); // Инициализируем список при запуске

  // Настраиваем интервал обновления каждые 5 минут
  setInterval(async () => {
    await updateChatAndChannelIds();
  }, 300000); // 300000 мс = 5 минут

  client.addEventHandler(async (event) => {
    const message = event.message;
    if (!message) return;

    const peerId = message.peerId;
    const senderId = message.fromId.userId.toString();
    let senderUsername = '';

    try {
      const sender = await client.getEntity(senderId);
      senderUsername = sender.username || '';
    } catch (error) {
      console.error(`Failed to fetch user data for ID ${senderId}: ${error.message}`);
    }

    const formattedMessage = {
      chatId: peerId.chatId ? peerId.chatId.value.toString() : peerId.channelId.value.toString(),
      sender: senderUsername || 'Unknown',
      userId: senderUsername ? undefined : senderId,
      text: message.message,
      timestamp: new Date(message.date * 1000),
    };

    console.log(`New message in chat ID ${formattedMessage.chatId}:`, formattedMessage);
    await saveMessageToDatabase(formattedMessage);
  }, new NewMessage({}));

  console.log('Message parsing has started...');
};

const saveMessageToDatabase = async (formattedMessage) => {
  const existingMessage = await Message.findOne({
    chatId: formattedMessage.chatId,
    sender: formattedMessage.sender,
    userId: formattedMessage.userId,
    text: formattedMessage.text,
    timestamp: formattedMessage.timestamp,
  });

  if (!existingMessage) {
    const message = new Message(formattedMessage);
    await message.save();
    console.log('Message saved to database:', formattedMessage);
  } else {
    console.log('Message already exists in database:', formattedMessage);
  }
};

module.exports = {
  startParsingMessages,
};

