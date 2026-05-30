// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker registered', reg))
            .catch(err => console.error('Service Worker registration failed', err));
    });
}

// Initialize Model
const model = new ToyTransformer(256, 16);

// UI Logic
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    msgDiv.textContent = text;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function handleSend() {
    const text = userInput.value.trim();
    if (!text) return;

    // Show User Message
    appendMessage(text, 'user');
    userInput.value = '';

    // Simulate thinking delay, then run Transformer
    setTimeout(() => {
        // Run inference through our pure JS Transformer
        const responseText = model.generate(text, 15);
        
        appendMessage(`[Random Weights Output]: ${responseText}`, 'model');
    }, 500);
}

sendBtn.addEventListener('click', handleSend);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
});
