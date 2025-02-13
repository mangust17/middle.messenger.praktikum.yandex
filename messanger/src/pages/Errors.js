import Handlebars from "handlebars";
import fourTemplate from "../templates/404.hbs?raw"; 
import fiveTemplate from "../templates/500.hbs?raw"; 
import { renderLogin } from "./Login.js";

export function render404Page() {
  const app = document.getElementById("app");
  app.innerHTML = Handlebars.compile(fourTemplate)();
  app.querySelector("#four-back").addEventListener("click", (event) => {
    event.preventDefault();
    renderLogin();
  });
}



export function render500Page() {
  const app = document.getElementById("app");
  app.innerHTML = Handlebars.compile(fiveTemplate)();
  app.querySelector("#five-back").addEventListener("click", (event) => {
    event.preventDefault();
    renderLogin();
  });
}
