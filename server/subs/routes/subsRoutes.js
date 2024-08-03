const express = require('express');
const { subscribeToChannelOrChat } = require('../subs');

const router = express.Router();

router.post('/subscribe', async (req, res) => {
  const { urlsOrUsernames } = req.body;
  try {
    const urls = urlsOrUsernames.split(',').map(url => url.trim());
    const results = [];
    for (const urlOrUsername of urls) {
      try {
        await subscribeToChannelOrChat(urlOrUsername);
        results.push({ urlOrUsername, status: 'Subscribed' });
      } catch (error) {
        results.push({ urlOrUsername, status: `Failed: ${error.message}` });
      }
    }
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error subscribing to channels or chats', error: error.message });
  }
});

module.exports = router;