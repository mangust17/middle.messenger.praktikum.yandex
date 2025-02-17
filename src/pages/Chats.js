import { ChatList } from "/src/components/ChatList.js";
import { ChatHeader } from "/src/components/ChatHeader.js";
import { ChatWindow } from "/src/components/ChatWindow.js";
import { renderProfile } from "./Profile.js";



export function renderChat() {
  const chatsData = [
    { 
      avatar: "/avatars/avatar1.jpg", name: "Андрей", lastMessage: "Привет!", unreadCount: 2, 
      status: "В сети ", messages: [{ text: "Привет!", isMine: false }]
    },
    { 
      avatar: "/avatars/avatar2.jpg", name: "Киноклуб", lastMessage: "Какой...", unreadCount: 1, 
      status: "Оффлайн", messages: [{ text: "Какой фильм смотрим?", isMine: false }]
    }
  ];

  const user = {
    avatar: "/avatars/avatar3.jpg",
    login: "user123",
    email: "user@example.com",
    firstName: "Иван",
    lastName: "Иванов",
    chatName: "IvanChat",
    phone: "+79991234567",
    password:"password",
    display_name:"Ванек"
  };
  
  

  const app = document.getElementById("app");
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

  let activeChat = null;

  function renderChat(chat) {
    activeChat = chat;
    chatContent.innerHTML = ""; 
    chatContent.appendChild(ChatHeader(chat));
    chatContent.appendChild(ChatWindow(chat));
  }
  const profileLink = document.createElement("a");
  profileLink.href = "#";
  profileLink.id = "profile-link";
  profileLink.textContent = "Профиль >";

  profileLink.addEventListener("click", (event) => {
    event.preventDefault();
    const app = document.getElementById("app");
    if (app) {
      app.innerHTML = "";
      renderProfile(user);
    }
  });


  const search = document.createElement("form");
  search.method="get";
  search.className="search-from"
  search.innerHTML=`
  <input name="s" placeholder="Искать здесь..." type="search">
  <button type="submit">Поиск</button>`

  sidebar.appendChild(profileLink);
  sidebar.appendChild(search);
  sidebar.appendChild(ChatList(chatsData, renderChat));
  renderChat(activeChat);
}
