export function ChatItem(chat, onSelect) {
  const chatItem = document.createElement("li");
  chatItem.className = "chat-item";
  
  chatItem.innerHTML = `
    <a href="#" class="chat-link">
      <img src="${chat.avatar}" alt="Avatar" class="chat-avatar">
      <div class="chat-info">
        <div class="chat-header">
          <span class="chat-name">${chat.name}</span>
          <span class="chat-time">12:45</span>
          <p class="chat-item-message">${chat.lastMessage || "Нет сообщений"}</p>
        </div>
        
      </div>
      ${chat.unreadCount > 0 ? `<span class="chat-unread">${chat.unreadCount}</span>` : ""}
    </a>
  `;

  chatItem.addEventListener("click", () => onSelect(chat));

  return chatItem;
}
