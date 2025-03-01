import Handlebars from "handlebars";
import regTemplate from "../templates/registration.hbs?raw"; 
import { createButton } from "../components/button";
import { renderLogin } from "./Login";
import { renderChat } from "./Chats";

export function renderRegistration(): void {
  const reg = document.createElement("div");
  reg.classList.add("login-container");

  reg.innerHTML = Handlebars.compile(regTemplate)();

  const button = createButton("sign-up", "Зарегистрироваться", () => renderChat());
  
  const footer = reg.querySelector(".login-footer");
  if (!footer) {
    throw new Error("Registration footer not found");
  }
  footer.prepend(button);

  const app = document.getElementById("app");
  if (!app) {
    throw new Error("App element not found");
  }
  app.innerHTML = ""; 
  app.appendChild(reg);

  const loginLink = reg.querySelector("#login-link");
  if (!loginLink) {
    throw new Error("Login link not found");
  }
  
  loginLink.addEventListener("click", (event: Event) => {
    event.preventDefault();
    const app = document.getElementById("app");
    if (!app) {
      throw new Error("App element not found");
    }
    app.innerHTML = "";
    renderLogin();
  });
} 