import { Block } from "../core/Block";

interface Message {
  text: string;
  isMine: boolean;
}

interface Chat {
  avatar: string;
  messages: Message[];
}
interface ChatWindowProps {
  chat?: Chat;
  [key: string]: any;
}

export class ChatWindow extends Block<ChatWindowProps> {
  constructor(props: ChatWindowProps) {
    super("div", props);
    this.element.classList.add("chat-window"); 
  }

  protected render(): string {
    const { chat } = this.props;

    if (!chat) {
      return `<p class="no-messages">Выберите чат, чтобы отправить сообщение</p>`;
    }

    const messagesHtml = chat.messages
      .map((msg) => {
        return `
          <div class="message-wrapper ${msg.isMine ? "justify-end" : "justify-start"}">
            ${
              !msg.isMine
                ? `<img src="${chat.avatar}" alt="Avatar" class="message-avatar">`
                : ""
            }
            <div class="message-content">${msg.text}</div>
            ${
              msg.isMine
                ? `<img src="current_user_avatar.jpg" alt="Avatar" class="message-avatar">`
                : ""
            }
          </div>
        `;
      })
      .join("");

    return `
      <div class="messages-container">${messagesHtml}</div>
      <div class="message-input-container">
        <form id="message-form" class="message-form">
          <input id="message-input" name="message" type="text" class="message-input" placeholder="Написать сообщение..." autocomplete="off">
          <button class="send-button" type="submit">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send" viewBox="0 0 16 16">
              <path d="M15.854 1.146a.5.5 0 0 1 .11.54l-5 14a.5.5 0 0 1-.94-.184L8.49 10.5 2.982 8.332a.5.5 0 0 1-.058-.927l13-6a.5.5 0 0 1 .93.36l-.001.001zM6.011 8 9 9.5l1.28 4.267L13.885 3.114 6.011 8z"/>
            </svg>
          </button>
        </form>
      </div>
    `;
  }

  protected addEvents(): void {
    const form = this.element.querySelector("#message-form");
    if (form) {
      form.addEventListener("submit", (event: Event) => {
        event.preventDefault();
        const input = this.element.querySelector("#message-input") as HTMLInputElement;
        if (input && input.value.trim()) {
          console.log("Отправлено сообщение:", input.value);
          input.value = ""; // Очищаем поле ввода
        }
      });
    }
  }
}