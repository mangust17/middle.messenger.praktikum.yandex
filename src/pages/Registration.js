import Handlebars from "handlebars";
import regTemplate from "../templates/registration.hbs?raw"; 
import { createButton } from "../components/button.js";
import { renderLogin } from "./Login.js";
import { renderChat } from "./Chats.js";


export function renderRegistration() {
  const reg = document.createElement("div");
  reg.classList.add("login-container");

  reg.innerHTML = Handlebars.compile(regTemplate)();

  const button = createButton("sign-up", "Зарегистрироваться",() => renderChat());
  const footer = reg.querySelector(".login-footer");
  if (footer) {
    footer.prepend(button);
  }

  const app = document.getElementById("app");
  if (app) {
    app.innerHTML = ""; 
    app.appendChild(reg);
  }

  const loginLink = reg.querySelector("#login-link");
  if (loginLink) {
    loginLink.addEventListener("click", (event) => {
      event.preventDefault();
      const app = document.getElementById("app");
      if (app) {
        app.innerHTML = "";
        renderLogin(); 
      }
    });
  }
}
