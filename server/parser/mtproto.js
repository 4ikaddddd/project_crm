const { TelegramClient, Api } = require('telegram');
const { StringSession } = require('telegram/sessions');
const { apiId, apiHash, sessionString } = require('../auth/login');

const client = new TelegramClient(new StringSession(sessionString), apiId, apiHash, { connectionRetries: 5 });

const connectClient = async () => {
  if (!client.connected) {
    await client.connect();
  }
};

const getChannelId = async (urlOrUsername) => {
  await connectClient();
  if (urlOrUsername.startsWith('https://t.me/joinchat/') || urlOrUsername.startsWith('https://t.me/+')) {
    const inviteHash = urlOrUsername.split('/').pop().replace('+', '');
    try {
      const result = await client.invoke(new Api.messages.CheckChatInvite({ hash: inviteHash }));
      if (result.chat) {
        return { id: result.chat.id.toString(), accessHash: result.chat.accessHash };
      } else if (result.channel) {
        return { id: result.channel.id.toString(), accessHash: result.channel.accessHash };
      } else {
        throw new Error('Не удалось получить идентификатор чата по пригласительной ссылке');
      }
    } catch (error) {
      console.error('Ошибка при получении идентификатора чата по пригласительной ссылке:', error.message);
      throw error;
    }
  } else {
    const username = urlOrUsername.startsWith('https://t.me/') ? urlOrUsername.split('/').pop() : urlOrUsername;
    try {
      const result = await client.invoke(new Api.contacts.ResolveUsername({ username }));
      if (result.chats.length > 0) {
        return { id: result.chats[0].id.toString(), accessHash: result.chats[0].accessHash };
      } else {
        throw new Error('Канал не найден');
      }
    } catch (error) {
      console.error('Ошибка при получении идентификатора канала:', error.message);
      throw error;
    }
  }
};

const getDiscussionChatId = async (channelId, accessHash) => {
  await connectClient();
  try {
    const result = await client.invoke(new Api.channels.GetFullChannel({ channel: new Api.InputChannel({ channelId, accessHash }) }));
    if (result.fullChat && result.fullChat.linkedChatId) {
      return result.fullChat.linkedChatId.toString();
    } else {
      console.log(`У канала ${channelId} нет обсуждений.`);
      return null;
    }
  } catch (error) {
    console.error('Ошибка при получении идентификатора обсуждения:', error.message);
    throw error;
  }
};

const getChatId = async (urlOrUsername) => {
    await connectClient();
    
    // Extract username from URL if full URL is provided
    const username = urlOrUsername.startsWith('https://t.me/') ? urlOrUsername.split('/').pop() : urlOrUsername;
  
    try {
      const result = await client.invoke(new Api.contacts.ResolveUsername({ username }));
      if (!result.chats || result.chats.length === 0) {
        throw new Error('Чат не найден');
      }
  
      const chatId = result.chats[0].id.toString();
      const link = `https://t.me/${result.chats[0].username}`;
  
      return { id: chatId, link };
    } catch (error) {
      console.error('Ошибка при получении идентификатора чата:', error.message);
      if (error.message.includes('USERNAME_INVALID')) {
        throw new Error('Некорректный URL или имя пользователя');
      }
      throw error;
    }
  };

module.exports = {
  getChannelId,
  getDiscussionChatId,
  getChatId,
};
