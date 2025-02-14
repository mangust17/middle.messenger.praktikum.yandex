import Handlebars from "handlebars";
import loginTemplate from "../templates/login.hbs?raw"; 
import { createButton } from "../components/button.js";
import { renderRegistration } from "./Registration.js";
import { renderChat } from "./Chats.js";
import { render404Page, render500Page } from "./Errors.js";

export function renderLogin() {
  const app = document.getElementById("app");
  app.innerHTML = Handlebars.compile(loginTemplate)();

  const loginContainer = document.querySelector(".login-container");

  const button = createButton("sign-in", "Войти", (event) => {
    event.preventDefault();
    renderChat();
  });

  const footer = loginContainer.querySelector(".login-footer");
  footer.prepend(button);

  loginContainer.querySelector("#register-link").addEventListener("click", (event) => {
    event.preventDefault();
    renderRegistration();
  });

  loginContainer.querySelector("#four-link").addEventListener("click", (event) => {
    event.preventDefault();
    render404Page();
  });

  loginContainer.querySelector("#five-link").addEventListener("click", (event) => {
    event.preventDefault();
    render500Page();
  });
}
