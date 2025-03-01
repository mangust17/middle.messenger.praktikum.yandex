import Handlebars from "handlebars";
import profileTemplate from "../templates/profile.hbs?raw"; 
import { createButton } from "../components/button";
import { renderChat } from "./Chats";

interface User {
  [key: string]: string;
}

interface InitialValues {
  [key: string]: string;
}

export function renderProfile(user: User): void {
  const app = document.getElementById("app");
  if (!app) {
    throw new Error("App element not found");
  }

  const template = Handlebars.compile(profileTemplate);
  app.innerHTML = template(user);

  const backButton = document.getElementById("back-button");
  if (!backButton) {
    throw new Error("Back button not found");
  }

  backButton.addEventListener("click", (event: Event) => {
    event.preventDefault();
    renderChat();
  });

  const buttonsContainer = document.getElementById("buttons-container");
  if (!buttonsContainer) {
    throw new Error("Buttons container not found");
  }

  const editButton = createButton("edit-data", "Изменить данные", () => {
    console.log("Изменение данных...");
  });
  editButton.disabled = true;

  const changePasswordButton = createButton("change-password", "Изменить пароль", () => {
    const inputsContainer = document.querySelector(".profile-form-inputs");
    if (!inputsContainer) {
      throw new Error("Inputs container not found");
    }

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

  const formInputs = document.querySelectorAll<HTMLInputElement>(".profile-form input");
  const initialValues: InitialValues = {};

  formInputs.forEach(input => {
    initialValues[input.id] = input.value;

    input.addEventListener("input", () => {
      const isFormChanged = Object.keys(initialValues).some(key => {
        const element = document.getElementById(key) as HTMLInputElement;
        return element && element.value !== initialValues[key];
      });
      editButton.disabled = !isFormChanged;
    });
  });
} 