export function createButton(id: string, text: string, onClick?: () => void): HTMLButtonElement {
  const button = document.createElement("button");
  button.id = id;
  button.type = "button";
  button.textContent = text;

  if (typeof onClick === "function") {
    button.addEventListener("click", onClick);
    console.log(1233);
  }

  return button;
} 