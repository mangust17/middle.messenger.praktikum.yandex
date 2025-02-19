export function ChatHeader(chat) {
  if (!chat) {
    return document.createElement("div");
  }

  const header = document.createElement("div");
  header.className = "chat-header";

  header.innerHTML = `
    <img src="${chat.avatar}" alt="Avatar" class="header-avatar">
    <div>
      <span class="header-name">${chat.name}</span>
      <span class="header-status">${chat.status || "Оффлайн"}</span>
    </div>
  `;

  return header;
}
