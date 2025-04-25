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
  users?: User[];
}

interface User {
  id: number;
  first_name: string;
  second_name: string;
  login: string;
  display_name: string | null;
  avatar: string | null;
}

const api = new ChatsAPI();

export default class ChatSidebar extends Block<ChatSidebarProps> {
  private users: User[] = [];

  constructor(props: ChatSidebarProps) {
    super({
      ...props,
      users: []
    });
  }

  protected async componentDidMount() {
    if (this.props.chat?.id) {
      await this.loadUsers();
    }
    return true;
  }

  protected componentDidUpdate(oldProps: ChatSidebarProps, newProps: ChatSidebarProps): boolean {
    console.log('componentDidUpdate:', { oldProps, newProps });

    if (oldProps.chat?.id !== newProps.chat?.id && newProps.chat?.id) {
      this.loadUsers();
      return true;
    }

    if (JSON.stringify(oldProps.users) !== JSON.stringify(newProps.users)) {
      console.log('Users changed:', newProps.users);
      return true;
    }

    return false;
  }

  private async loadUsers() {
    if (!this.props.chat?.id) return;
    try {
      const response = await api.getChatUsers(this.props.chat.id) as XMLHttpRequest;
      const users = JSON.parse(response.responseText);
      console.log('Получены пользователи чата:', users);
      this.users = users;
      console.log('Установлены пользователи в this.users:', this.users);
      this.setProps({
        ...this.props,
        users: this.users
      });
      console.log('Пропсы обновлены:', this.props);
    } catch (err) {
      console.error('Ошибка загрузки пользователей:', err);
    }
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
          await this.loadUsers();
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
          await this.loadUsers();
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
    console.log('Рендер ChatSidebar с пропсами:', this.props);
    console.log('Текущие пользователи:', this.users);
    return this.compile(chatSidebarTemplate, {
      ...this.props,
      users: this.users || []
    });
  }
}
