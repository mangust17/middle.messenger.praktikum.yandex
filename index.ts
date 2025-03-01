import { renderLogin } from "./src/pages/Login";

const app = document.getElementById("app");
if (!app) {
  throw new Error("App element not found");
}
app.innerHTML = "";

renderLogin(); 