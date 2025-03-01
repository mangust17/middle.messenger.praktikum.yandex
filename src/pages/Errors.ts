import Handlebars from "handlebars";
import fourTemplate from "../templates/404.hbs?raw"; 
import fiveTemplate from "../templates/500.hbs?raw"; 
import { renderLogin } from "./Login";

export function render404Page(): void {
  const app = document.getElementById("app");
  if (!app) {
    throw new Error("App element not found");
  }
  
  app.innerHTML = Handlebars.compile(fourTemplate)({});
  
  const backButton = app.querySelector("#four-back");
  if (!backButton) {
    throw new Error("Back button not found");
  }
  
  backButton.addEventListener("click", (event: Event) => {
    event.preventDefault();
    renderLogin();
  });
}

export function render500Page(): void {
  const app = document.getElementById("app");
  if (!app) {
    throw new Error("App element not found");
  }
  
  app.innerHTML = Handlebars.compile(fiveTemplate)({});
  
  const backButton = app.querySelector("#five-back");
  if (!backButton) {
    throw new Error("Back button not found");
  }
  
  backButton.addEventListener("click", (event: Event) => {
    event.preventDefault();
    renderLogin();
  });
} 