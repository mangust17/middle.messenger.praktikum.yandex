import Block from '../../core/block';
import chatSidebarTemplate from './chatSidebar.hbs?raw';
import { Chat } from '../../utils/types/type';
import './chatSidebar.pcss';

interface ChatSidebarProps {
  chat?: Chat;
  onAddUser?: () => void;
  onRemoveUser?: () => void;
  onChangeAvatar?: () => void;
}

export default class ChatSidebar extends Block<ChatSidebarProps> {
  constructor(props: ChatSidebarProps) {
    super(props);
  }

  protected render() {
    return this.compile(chatSidebarTemplate, this.props);
  }

  protected addEvents(): void {
    const content = this.getContent();
    content?.querySelector('#add-user')?.addEventListener('click', () => {
      this.props.onAddUser?.();
    });
    content?.querySelector('#remove-user')?.addEventListener('click', () => {
      this.props.onRemoveUser?.();
    });
    content?.querySelector('#change-avatar')?.addEventListener('click', () => {
      this.props.onChangeAvatar?.();
    });
  }
}
