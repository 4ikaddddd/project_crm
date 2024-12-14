const API_URL = 'http://localhost:5102/api_3';

export const connectWebSocket = (onMessage) => {
  const ws = new WebSocket('ws://localhost:5102');

  ws.onopen = () => {
    console.log('WebSocket connection opened');
  };

  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    onMessage(message);
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  ws.onclose = () => {
    console.log('WebSocket connection closed');
  };

  return ws;
};

export async function joinChat(urls) {
  console.log('Sending URLs:', urls);

  const response = await fetch(`${API_URL}/subs/subscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ urlsOrUsernames: urls.join(',') }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to join chat');
  }
  return data;
}

export async function fetchChats() {
  const response = await fetch(`${API_URL}/parser/channels`);
  return response.json();
}

export async function createChats(chatData) {
  const response = await fetch(`${API_URL}/parser/channel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(chatData),
  });
  if (!response.ok) {
    throw new Error(`Error creating chat: ${response.statusText}`);
  }
  return response.json();
}

export async function deleteChat(id) {
  const response = await fetch(`${API_URL}/parser/channel/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`Error deleting chat: ${response.statusText}`);
  }
  return response.json();
}

// Функция для получения списка ключевых слов
export async function fetchKeywords() {
  const response = await fetch(`${API_URL}/filter_sms/keywords`);
  if (!response.ok) {
    throw new Error(`Error fetching keywords: ${response.statusText}`);
  }
  return response.json();
}

export async function addKeyword(keyword) {
  try {
    const response = await fetch(`${API_URL}/filter_sms/keywords`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ keyword }), // Передаем строку в JSON-формате
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Ошибка при добавлении ключевого слова: ${errorData.message}`);
    }
    return response.json();
  } catch (error) {
    console.error('Ошибка при добавлении ключевого слова:', error);
    throw error;
  }
}


// Функция для удаления ключевого слова
export async function deleteKeyword(id) {
  const response = await fetch(`${API_URL}/filter_sms/keywords/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`Error deleting keyword: ${response.statusText}`);
  }
  return response.json();
}

export async function getSubscriptions() {
  const response = await fetch(`${API_URL}/subs/subscriptions`);
  if (!response.ok) {
    throw new Error(`Error fetching subscriptions: ${response.statusText}`);
  }
  return response.json();
}
// Функция для получения списка чатов
export async function getChatList() {
  const response = await fetch(`${API_URL}/parser/chats`);
  if (!response.ok) {
    throw new Error(`Error fetching chats: ${response.statusText}`);
  }
  return response.json();
}

// Функция для создания чатов
export async function addChat(chatData) {
  const response = await fetch(`${API_URL}/parser/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(chatData),
  });
  if (!response.ok) {
    throw new Error(`Error creating chat: ${response.statusText}`);
  }
  return response.json();
}
// Функция для получения списка сообщений
export async function fetchMessages(query = '') {
  const response = await fetch(`${API_URL}/filter_sms/messages${query ? `?${query}` : ''}`);
  if (!response.ok) {
    throw new Error(`Error fetching messages: ${response.statusText}`);
  }
  return response.json();
}
// Функция для удаления чата
export async function removeChat(id) {
  const response = await fetch(`${API_URL}/parser/chat/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`Error deleting chat: ${response.statusText}`);
  }
  return response.json();
}