const { TelegramClient, Api } = require('telegram');
const { StringSession } = require('telegram/sessions');
const { apiId, apiHash, sessionString } = require('../auth/login');

const client = new TelegramClient(new StringSession(sessionString), apiId, apiHash, { connectionRetries: 5 });

const connectClient = async () => {
  if (!client.connected) {
    await client.connect();
  }
};

const subscribeToChannelOrChat = async (urlOrUsername) => {
  await connectClient();
  const username = urlOrUsername.startsWith('https://t.me/') ? urlOrUsername.split('/').pop() : urlOrUsername;
  try {
    await client.invoke(new Api.channels.JoinChannel({ channel: username }));
    console.log(`Successfully subscribed to ${urlOrUsername}`);
  } catch (error) {
    console.error(`Failed to subscribe to ${urlOrUsername}:`, error.message);
    throw error;
  }
};

module.exports = {
  subscribeToChannelOrChat,
};