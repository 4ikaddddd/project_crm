const API_URL = 'https://www.cola-workeu.com/api';

export async function fetchMessages(query = '') {
  const response = await fetch(`${API_URL}/messages?${query}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}
