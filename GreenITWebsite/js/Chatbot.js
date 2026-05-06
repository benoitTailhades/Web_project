class ChatHistory {
  constructor() {
    this.messages = [];
  }

  addMessage(message) {
    this.messages.push(message);
  }
  getHistory() {
    return this.messages;
  }
}

const historyMessages = new ChatHistory();


function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getCurrentDateTime() {
  const now = new Date();
  return now.toLocaleString([], {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}


function showMessage(message, type) {
  const chatBox = document.getElementById('chat-box');

  const wrapper = document.createElement('div');
  wrapper.classList.add('message', type);

  const text = document.createElement('span');
  text.textContent = message;

  const meta = document.createElement('span');
  meta.classList.add('message-meta');
  meta.textContent = getCurrentDateTime();

  wrapper.appendChild(text);
  wrapper.appendChild(meta);
  chatBox.appendChild(wrapper);

  chatBox.scrollTop = chatBox.scrollHeight;
}


function processMessage(intents, message) {
  let response = "I'm sorry, I'm not sure I understand. Could you please rephrase?";

  let matched = false;
  intents.forEach(intent => {
    if (matched) return; // stop after first match for clarity
    intent.patterns.forEach(pattern => {
      if (pattern && message.toLowerCase().includes(pattern.toLowerCase())) {
        response = intent.responses[Math.floor(Math.random() * intent.responses.length)];
        matched = true;
      }
    });
  });

  if (!matched) {
    const fallbackIntent = intents.find(i => i.tag === 'fallback');
    if (fallbackIntent && fallbackIntent.responses.length > 0) {
      response = fallbackIntent.responses[Math.floor(Math.random() * fallbackIntent.responses.length)];
    }
  }

  return response;
}


function sendMessage(intents) {
  const inputEl = document.getElementById('user-input');
  const userText = inputEl.value.trim();

  if (!userText) return;

  showMessage(userText, 'user');

  historyMessages.addMessage({ message: userText, sender: 'user', time: getCurrentDateTime() });

  const botResponse = processMessage(intents, userText);

  setTimeout(() => {
    showMessage(botResponse, 'bot');
    historyMessages.addMessage({ message: botResponse, sender: 'bot', time: getCurrentDateTime() });
  }, 350);

  inputEl.value = '';
  inputEl.focus();
}


function fetchJSON(url) {
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      if (Object.keys(data).length === 0 && data.constructor === Object) {
        throw new Error('Empty JSON or malformed JSON');
      }
      console.log(data);
      sendMessage(data.intents);
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
}


function saveMessages() {
  console.log('Saving chat history...');
  console.log(historyMessages.getHistory());
  sessionStorage.setItem(
    'chatHistory',
    JSON.stringify(historyMessages.getHistory().map(msg => msg))
  );
}

function loadMessages() {
  const chatHistory = JSON.parse(sessionStorage.getItem('chatHistory'));
  if (chatHistory && chatHistory.length > 0) {

    const chatBox = document.getElementById('chat-box');

    const separator = document.createElement('div');
    separator.classList.add('history-separator');
    separator.textContent = '✦  Previous session restored  ✦';
    chatBox.appendChild(separator);

    chatHistory.forEach(msg => {
      const wrapper = document.createElement('div');
      wrapper.classList.add('message', msg.sender);

      const text = document.createElement('span');
      text.textContent = msg.message;

      const meta = document.createElement('span');
      meta.classList.add('message-meta');
      meta.textContent = msg.time || '';

      wrapper.appendChild(text);
      wrapper.appendChild(meta);
      chatBox.appendChild(wrapper);

      historyMessages.addMessage(msg);
    });

    chatBox.scrollTop = chatBox.scrollHeight;
  }
}


window.addEventListener('beforeunload', saveMessages);


document.addEventListener('DOMContentLoaded', () => {
  loadMessages();

  const inputEl = document.getElementById('user-input');
  if (inputEl) {
    inputEl.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        fetchJSON('../Json/intents.json');
      }
    });
  }
});