import { ChatList } from "../components/ChatList";
import { createChatHeader } from "../components/createChatHeader";
import { ChatWindow } from "../components/ChatWindow";
import { renderProfile } from "./Profile";

export interface Message {
  text: string;
  isMine: boolean;
}

export interface Chat {
  avatar: string;
  name: string;
  lastMessage: string;
  unreadCount: number;
  status: string;
  messages: Message[];
}

interface User {
  [key: string]: string;
  avatar: string;
  login: string;
  email: string;
  firstName: string;
  lastName: string;
  chatName: string;
  phone: string;
  password: string;
  display_name: string;
}

export function renderChat(): void {
  const chatsData: Chat[] = [
    { 
      avatar: "/avatars/avatar1.jpg",
      name: "Андрей",
      lastMessage: "Привет!",
      unreadCount: 2, 
      status: "В сети",
      messages: [{ text: "Привет!", isMine: false }]
    },
    { 
      avatar: "/avatars/avatar2.jpg",
      name: "Киноклуб",
      lastMessage: "Какой...",
      unreadCount: 1, 
      status: "Оффлайн",
      messages: [{ text: "Какой фильм смотрим?", isMine: false }]
    }
  ];

  const user: User = {
    avatar: "/avatars/avatar3.jpg",
    login: "user123",
    email: "user@example.com",
    firstName: "Иван",
    lastName: "Иванов",
    chatName: "IvanChat",
    phone: "+79991234567",
    password: "password",
    display_name: "Ванек"
  };

  const app = document.getElementById("app");
  if (!app) {
    throw new Error("App element not found");
  }
  app.innerHTML = ""; 

  const container = document.createElement("div");
  container.className = "chat-container";

  const sidebar = document.createElement("div");
  sidebar.className = "sidebar";
  
  const chatContent = document.createElement("div");
  chatContent.className = "chat-content"; 

  container.appendChild(sidebar);
  container.appendChild(chatContent);
  app.appendChild(container);


  function renderSelectedChat(chat: Chat): void {
    chatContent.innerHTML = ""; 
    chatContent.appendChild(createChatHeader(chat));
    const chatWindow = new ChatWindow({ chat });
    chatContent.appendChild(chatWindow.element);
  }

  const profileLink = document.createElement("a");
  profileLink.href = "#";
  profileLink.id = "profile-link";
  profileLink.textContent = "Профиль >";

  profileLink.addEventListener("click", (event: Event) => {
    event.preventDefault();
    const app = document.getElementById("app");
    if (!app) {
      throw new Error("App element not found");
    }
    app.innerHTML = "";
    renderProfile(user);
  });

  const search = document.createElement("form");
  search.method = "get";
  search.className = "search-from";
  search.innerHTML = `
    <input name="s" placeholder="Искать здесь..." type="search">
    <button type="submit">Поиск</button>
  `;

  sidebar.appendChild(profileLink);
  sidebar.appendChild(search);
  sidebar.appendChild(ChatList(chatsData, (chat) => {
    renderSelectedChat({
      ...chat,
      status: 'online',
      messages: [],
      lastMessage: chat.lastMessage || ''
    });
  }));
  
  if (chatsData.length > 0) {
    renderSelectedChat({
      ...chatsData[0],
      status: 'online', 
      messages: []
    });
  }
} 