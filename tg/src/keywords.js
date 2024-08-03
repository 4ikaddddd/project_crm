const API_URL = 'https://www.cola-workeu.com/api';

export const connectWebSocket = (onMessage) => {
  const ws = new WebSocket('wss://www.cola-workeu.com/api');

  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    onMessage(message);
  };

  return ws;
};

export async function fetchKeywords() {
  const response = await fetch(`${API_URL}/keywords`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

export async function addKeyword(keyword) {
  const response = await fetch(`${API_URL}/keywords`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ keyword }),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}
