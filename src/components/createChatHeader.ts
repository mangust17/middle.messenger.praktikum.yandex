import { Chat } from "../pages/Chats";
import { ChatHeader } from "./ChatHeader";

export function createChatHeader(chat?: Chat): HTMLDivElement {
  if (!chat) {
    return document.createElement("div"); 
  }

  const chatHeader = new ChatHeader({
    avatar: chat.avatar,
    name: chat.name,
    status: chat.status,
  });

  return chatHeader.element as HTMLDivElement;
}