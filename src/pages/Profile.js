import Handlebars from "handlebars";
import profileTemplate from "../templates/profile.hbs?raw"; 
import { createButton } from "../components/button.js";
import { renderChat } from "./Chats.js";

export function renderProfile(user) {
  const app = document.getElementById("app");

  const template = Handlebars.compile(profileTemplate);
  app.innerHTML = template(user);


  document.getElementById("back-button").addEventListener("click", (event) => {
    event.preventDefault();
    renderChat();
  });

  const buttonsContainer = document.getElementById("buttons-container");

  const editButton = createButton("edit-data", "Изменить данные", () => {
    console.log("Изменение данных...");
  });
  editButton.disabled = true;

  const changePasswordButton = createButton("change-password", "Изменить пароль", () => {
    const inputsContainer = document.querySelector(".profile-form-inputs");

    const oldPassword = document.createElement("input");
    oldPassword.type = "password";
    oldPassword.placeholder = "Старый пароль";
    oldPassword.id = "old-password";

    const newPassword = document.createElement("input");
    newPassword.type = "password";
    newPassword.placeholder = "Новый пароль";
    newPassword.id = "new-password";

    inputsContainer.appendChild(oldPassword);
    inputsContainer.appendChild(newPassword);
    changePasswordButton.disabled = true;
  });

  const logoutButton = createButton("logout", "Выйти из аккаунта", () => {
    console.log("Выход из аккаунта...");
  });

  buttonsContainer.appendChild(editButton);
  buttonsContainer.appendChild(changePasswordButton);
  buttonsContainer.appendChild(logoutButton);

  const formInputs = document.querySelectorAll(".profile-form input");
  const initialValues = {};

  formInputs.forEach(input => {
    initialValues[input.id] = input.value;

    input.addEventListener("input", () => {
      const isFormChanged = Object.keys(initialValues).some(
        key => document.getElementById(key).value !== initialValues[key]
      );
      editButton.disabled = !isFormChanged;
    });
  });
}
