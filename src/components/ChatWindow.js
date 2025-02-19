export function ChatWindow(chat) {
  const container = document.createElement("div");
  container.className = "chat-window";

  if (!chat) {
    container.innerHTML = "<p class='no-messages'>Выберите чат, чтобы отправить сообщение</p>";
    return container;
  }

  const messagesContainer = document.createElement("div");
  messagesContainer.className = "messages-container";

  chat.messages.forEach(msg => {
    const messageWrapper = document.createElement("div");
    messageWrapper.className = `message-wrapper ${msg.isMine ? "justify-end" : "justify-start"}`;

    if (!msg.isMine) {
      const avatar = document.createElement("img");
      avatar.src = chat.avatar;
      avatar.alt = "Avatar";
      avatar.className = "message-avatar";
      messageWrapper.appendChild(avatar);
    }

    const messageContent = document.createElement("div");
    messageContent.className = "message-content";
    messageContent.textContent = msg.text;

    messageWrapper.appendChild(messageContent);

    if (msg.isMine) {
      const avatar = document.createElement("img");
      avatar.src = "current_user_avatar.jpg"; // Сюда потом передам аватар текущего пользователя
      avatar.alt = "Avatar";
      avatar.className = "message-avatar";
      messageWrapper.appendChild(avatar);
    }

    messagesContainer.appendChild(messageWrapper);
  });

  const messageInput = document.createElement("div");
  messageInput.className = "message-input-container";
  messageInput.innerHTML = `
    <form id="message-form" class="message-form">
      <input id="message-input" type="text" class="message-input" placeholder="Написать сообщение..." autocomplete="off">
      <button class="send-button" type="submit">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send" viewBox="0 0 16 16">
          <path d="M15.854 1.146a.5.5 0 0 1 .11.54l-5 14a.5.5 0 0 1-.94-.184L8.49 10.5 2.982 8.332a.5.5 0 0 1-.058-.927l13-6a.5.5 0 0 1 .93.36l-.001.001zM6.011 8 9 9.5l1.28 4.267L13.885 3.114 6.011 8z"/>
        </svg>
      </button>
    </form>
  `;

  container.appendChild(messagesContainer);
  container.appendChild(messageInput);
  return container;
}
