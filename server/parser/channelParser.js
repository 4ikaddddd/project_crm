const { getChannelId, getDiscussionChatId } = require('./mtproto');
const { saveChannel } = require('./controller_chat_id/channelController');

const parseChannel = async (urlOrUsername, isPrivate = false) => {
  try {
    // Получение идентификатора канала и access_hash
    const { id: channelId, accessHash } = await getChannelId(urlOrUsername);
    const discussionId = await getDiscussionChatId(channelId, accessHash);

    const username = urlOrUsername.startsWith('https://t.me/') ? urlOrUsername.split('/').pop() : urlOrUsername;
    const link = `https://t.me/${username}`;

    const savedChannel = await saveChannel(channelId, discussionId, link);

    return savedChannel;
  } catch (error) {
    console.error('Ошибка при парсинге канала:', error.message);
    throw error;
  }
};

module.exports = {
  parseChannel,
};
