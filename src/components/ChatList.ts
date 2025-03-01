import { ChatItem } from "./ChatItem";

interface Chat {
  avatar: string;
  name: string;
  lastMessage?: string;
  unreadCount: number;
}

export function ChatList(chats: Chat[], onSelect: (chat: Chat) => void): HTMLUListElement {
  const chatList = document.createElement("ul");
  chatList.className = "chat-list";

  chats.forEach(chat => {
    chatList.appendChild(ChatItem(chat, onSelect));
  });

  return chatList;
} 