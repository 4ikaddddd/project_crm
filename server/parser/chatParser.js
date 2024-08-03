const { getChatId } = require('./mtproto');
const { saveChat } = require('./controller_chat_id/chatController');

const parseChat = async (urlOrUsername) => {
  try {
    console.log(`Parsing chat: ${urlOrUsername}`);
    const { id: chatId, link } = await getChatId(urlOrUsername);
    console.log(`Chat ID: ${chatId}, Link: ${link}`);
    const savedChat = await saveChat(chatId, link);
    console.log('Chat saved successfully:', savedChat);

    return savedChat;
  } catch (error) {
    console.error('Ошибка при парсинге чата:', error.message);
    throw error;
  }
};

module.exports = {
  parseChat,
};