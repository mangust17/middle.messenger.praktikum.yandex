import { ChatItem } from "./ChatItem.js";

export function ChatList(chats, onSelect) {
  const chatList = document.createElement("ul");
  chatList.className = "chat-list";

  chats.forEach(chat => {
    chatList.appendChild(ChatItem(chat, onSelect));
  });

  return chatList;
}
