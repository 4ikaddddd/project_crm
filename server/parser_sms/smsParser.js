const { TelegramClient, Api } = require('telegram');
const { StringSession } = require('telegram/sessions');
const { NewMessage } = require('telegram/events');
const { apiId, apiHash, sessionString } = require('../auth/login');
const Message = require('./models/Message');
const { Channel } = require('../parser/controller_chat_id/channelController');

const client = new TelegramClient(new StringSession(sessionString), apiId, apiHash, { connectionRetries: 5 });

const connectClient = async () => {
  if (!client.connected) {
    await client.connect();
  }
};

const startParsingMessages = async () => {
  await connectClient();

  const channels = await Channel.find({});
  const discussionChatIds = channels.map(channel => BigInt(channel.discussionId));
  console.log('Parsing messages for discussion chat IDs:', discussionChatIds);

  client.addEventHandler(async (event) => {
    const message = event.message;
    if (!message) {
      return;
    }

    const peerId = message.peerId;
    if (peerId && peerId.channelId && discussionChatIds.includes(peerId.channelId.value)) {
      const messageText = message.message;
      const sender = await client.getEntity(message.fromId.userId);

      const formattedMessage = {
        chatId: peerId.channelId.value.toString(),
        sender: sender.username || sender.id.toString(),
        text: messageText,
        timestamp: new Date(message.date * 1000),
      };

      console.log(`New message in chat ID ${peerId.channelId.value}:`, formattedMessage);

      // Сохранение сообщения в базу данных
      await saveMessageToDatabase(formattedMessage);
    }
  }, new NewMessage({}));

  console.log(`Парсинг сообщений начат...`);
};

const saveMessageToDatabase = async (formattedMessage) => {
  const existingMessage = await Message.findOne({
    chatId: formattedMessage.chatId,
    sender: formattedMessage.sender,
    text: formattedMessage.text,
    timestamp: formattedMessage.timestamp,
  });

  if (!existingMessage) {
    const message = new Message(formattedMessage);
    await message.save();
    console.log(`Message saved to database:`, formattedMessage);
  } else {
    console.log(`Message already exists in database:`, formattedMessage);
  }
};

module.exports = {
  startParsingMessages,
};
