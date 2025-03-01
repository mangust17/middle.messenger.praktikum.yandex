import { renderLogin } from "./pages/Login";

const app = document.getElementById("app");
if (!app) {
  throw new Error("App element not found");
}
app.innerHTML = "";

renderLogin(); 