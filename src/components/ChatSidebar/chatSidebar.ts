import Block from '../../core/block';
import chatSidebarTemplate from './chatSidebar.hbs?raw';
import { Chat } from '../../utils/types/type';
import './chatSidebar.pcss';
import { ChatsAPI } from '../../core/api/chats_api';
import { Button } from '../Button';

interface ChatSidebarProps {
  chat?: Chat;
  onAddUser?: () => void;
  onRemoveUser?: () => void;
  onChangeAvatar?: () => void;
}

const api = new ChatsAPI();

export default class ChatSidebar extends Block<ChatSidebarProps> {
  constructor(props: ChatSidebarProps) {
    super(props);
  }

  protected initChildren() {
    this.children.addUserButton = new Button({
      id: 'add-user',
      text: 'Добавить пользователя',
      onClick: async (e: Event) => {
        e.preventDefault();
        if (!this.props.chat?.id) return alert('Чат не выбран');
        try {
          const userId = Number(prompt('Введите ID пользователя для добавления'));
          if (!userId) return;
          await api.addUserToChat(userId, this.props.chat.id);
          alert('Пользователь добавлен');
          this.props.onAddUser?.();
        } catch (err) {
          alert('Ошибка добавления пользователя');
        }
      }
    });

    this.children.removeUserButton = new Button({
      id: 'remove-user',
      text: 'Удалить пользователя',
      onClick: async (e: Event) => {
        e.preventDefault();
        if (!this.props.chat?.id) return alert('Чат не выбран');
        try {
          const userId = Number(prompt('Введите ID пользователя для удаления'));
          if (!userId) return;
          await api.removeUserFromChat(userId, this.props.chat.id);
          alert('Пользователь удалён');
          this.props.onRemoveUser?.();
        } catch (err) {
          alert('Ошибка удаления пользователя');
        }
      }
    });

    this.children.changeAvatarButton = new Button({
      id: 'change-avatar',
      text: 'Изменить аватар',
      onClick: async (e: Event) => {
        e.preventDefault();
        if (!this.props.chat?.id) return alert('Чат не выбран');
        try {
          alert('Пока функция изменения аватара не реализована');
          this.props.onChangeAvatar?.();
        } catch (err) {
          alert('Ошибка смены аватара');
        }
      }
    });
  }

  protected render() {
    return this.compile(chatSidebarTemplate, this.props);
  }
}