import Handlebars from "handlebars";
import loginTemplate from "../templates/login.hbs?raw"; 
import { createButton } from "../components/button";
import { renderRegistration } from "./Registration";
import { renderChat } from "./Chats";
import { render404Page, render500Page } from "./Errors";

export function renderLogin(): void {
  const app = document.getElementById("app");
  if (!app) {
    throw new Error("App element not found");
  }
  
  app.innerHTML = Handlebars.compile(loginTemplate)({});

  const loginContainer = document.querySelector(".login-container");
  if (!loginContainer) {
    throw new Error("Login container not found");
  }

  const button = createButton("sign-in", "Войти", () => {
    renderChat();
  });

  const footer = loginContainer.querySelector(".login-footer");
  if (!footer) {
    throw new Error("Login footer not found");
  }
  footer.prepend(button);

  const registerLink = loginContainer.querySelector("#register-link");
  if (!registerLink) {
    throw new Error("Register link not found");
  }
  registerLink.addEventListener("click", (event: Event) => {
    event.preventDefault();
    renderRegistration();
  });

  const fourLink = loginContainer.querySelector("#four-link");
  if (!fourLink) {
    throw new Error("404 link not found");
  }
  fourLink.addEventListener("click", (event: Event) => {
    event.preventDefault();
    render404Page();
  });

  const fiveLink = loginContainer.querySelector("#five-link");
  if (!fiveLink) {
    throw new Error("500 link not found");
  }
  fiveLink.addEventListener("click", (event: Event) => {
    event.preventDefault();
    render500Page();
  });
} 