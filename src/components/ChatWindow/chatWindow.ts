import Block from '../../core/block';
import chatWindowTemplate from './chatWindow.hbs?raw';
import { Chat } from '../../types/type';
import './chatWindow.css';

interface ChatWindowProps {
  chat?: Chat;
  currentUser?: {
    avatar: string;
    name: string;
  };
}

export default class ChatWindow extends Block<ChatWindowProps> {
  constructor(props: ChatWindowProps) {
    console.log('ChatWindow constructor with props:', props);
    super(props);
  }

  protected render() {
    console.log('ChatWindow render with props:', this.props);
    return this.compile(chatWindowTemplate, this.props);
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

  componentDidMount() {
    console.log('ChatWindow mounted with props:', this.props);
    this.addEvents();
  }

  protected componentDidUpdate(oldProps: ChatWindowProps, newProps: ChatWindowProps): boolean {
    console.log('ChatWindow update:', { oldProps, newProps });
    if (oldProps.chat !== newProps.chat) {
      console.log('ChatWindow chat changed:', newProps.chat);
    }
    return true;
  }
}
