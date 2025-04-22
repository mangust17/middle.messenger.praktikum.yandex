import Block from '../../core/block';
import chatWindowTemplate from './chatWindow.hbs?raw';
import { Chat } from '../../utils/types/type';
import ChatSidebar from '../ChatSidebar/chatSidebar';
import './chatWindow.pcss';

interface ChatWindowProps {
  chat?: Chat;
  currentUser?: {
    avatar: string;
    name: string;
  };
  onAddUser?: () => void;
  onRemoveUser?: () => void;
  onChangeAvatar?: () => void;
}

export default class ChatWindow extends Block<ChatWindowProps> {
  constructor(props: ChatWindowProps) {
    super({
      ...props,
      chatSidebar: new ChatSidebar({
        chat: props.chat,
        onAddUser: props.onAddUser,
        onRemoveUser: props.onRemoveUser,
        onChangeAvatar: props.onChangeAvatar,
      }),
    });
  }

  protected componentDidUpdate(oldProps: ChatWindowProps, newProps: ChatWindowProps): boolean {
    if (this.children.chatSidebar) {
      this.children.chatSidebar.setProps({
        chat: newProps.chat,
      });
    }
    return true;
  }

  protected render() {
    return this.compile(chatWindowTemplate, {
      ...this.props,
    });
  }

  protected addEvents(): void {
    const form = this.getContent()?.querySelector('#message-form');

    form?.addEventListener('submit', (event: Event) => {
      event.preventDefault();

      const input = this.getContent()?.querySelector('#message-input') as HTMLInputElement;

      if (input?.value.trim()) {
        console.log('Отправлено сообщение:', input.value);
        input.value = '';
      }
    });
  }
}
