import { Block } from "../core/Block";

interface ChatHeaderProps {
  avatar: string;
  name: string;
  status?: string;
  [key: string]: any;
}

export class ChatHeader extends Block<ChatHeaderProps> {
  constructor(props: ChatHeaderProps) {
    super("div", props);
  }

  protected render(): string {
    const { avatar, name, status = "Оффлайн" } = this.props;

    return `
      <div class="chat-header">
        <img src="${avatar}" alt="Avatar" class="header-avatar">
        <div>
          <span class="header-name">${name}</span>
          <span class="header-status">${status}</span>
        </div>
      </div>
    `;
  }
}