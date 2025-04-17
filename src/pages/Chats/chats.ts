import Block from '../../core/block';
import router from '../../core/router';
import { Button } from '../../components/Button';
import chatsPageTemplate from './chats.hbs?raw';
import { ChatList } from '../../components/ChatList';
import { ChatHeader } from '../../components/ChatHeader';
import { ChatWindow } from '../../components/ChatWindow';
import { Chat } from '../../utils/types/type';
import { ChatsAPI } from '../../core/api/chats_api';
import store from '../../core/store';
import './chats.pcss';

interface ChatsPageProps {
  selectedChat?: Chat;
  chats: Chat[];
  currentUser: {
    avatar: string;
    name: string;
  };
}

export default class ChatsPage extends Block<ChatsPageProps> {
  private chatsAPI: ChatsAPI;

  constructor(props?: Partial<ChatsPageProps>) {
    super({
      chats: [],
      currentUser: store.getState().user || { avatar: '', name: '' },
      settingsButton: new Button({
        id: 'settings-btn',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gear" viewBox="0 0 16 16">
            <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
            <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.319.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
          </svg>`,
        onClick: () => router.go('/settings'),
      }),
      ...props,
    });

    this.chatsAPI = new ChatsAPI();
    this.loadChats();
  }

  private async loadChats() {
    try {
      const chats = await this.chatsAPI.getChats() as XMLHttpRequest;
      const parsedChats = JSON.parse(chats.responseText);
      console.log('Чаты загружены:', parsedChats);
      this.setProps({ chats: parsedChats });
    } catch (error: any) {
      console.error('Ошибка загрузки чатов:', error);
      alert(error.reason || 'Ошибка загрузки чатов');
    }
  }

  private async setSelectedChat(chatId: number) {
    const chat = this.props.chats.find(c => c.id === chatId);
    if (!chat) return;

    console.log('Выбран чат:', chat);

    try {
      const token = await this.chatsAPI.getChatToken(chat.id) as XMLHttpRequest;
      const parsedToken = JSON.parse(token.responseText);
      console.log('Токен чата получен:', parsedToken);

      this.setProps({
        selectedChat: {
          ...chat,
          token: parsedToken.token
        },
      });

      this.children.chatHeader.setProps({
        avatar: chat.avatar || '',
        name: chat.title,
        status: 'online',
      });

      this.children.chatWindow.setProps({
        chat: {
          ...chat,
          token: parsedToken.token
        },
        currentUser: this.props.currentUser,
      });
    } catch (error: any) {
      console.error('Ошибка получения токена чата:', error);
      alert(error.reason || 'Ошибка получения токена чата');
    }
  }

  protected initChildren() {
    this.children.chatList = new ChatList({
      chats: this.props.chats,
      onChatClick: this.setSelectedChat.bind(this),
      onCreateChat: async (title: string) => {
        try {
          const chat = await this.chatsAPI.createChat(title);
          await this.loadChats();
          alert('Чат успешно создан');
        } catch (error: any) {
          console.error('Ошибка создания чата:', error);
          alert(error.reason || 'Ошибка создания чата');
        }
      },
      onAddUser: async (chatId: number) => {
        const login = prompt('Введите логин пользователя:');
        if (login) {
          try {
            const userId = parseInt(login, 10);
            if (!isNaN(userId)) {
              await this.chatsAPI.addUsersToChat([userId], chatId);
              alert('Пользователь успешно добавлен в чат');
            } else {
              alert('Неверный формат ID пользователя');
            }
          } catch (error: any) {
            console.error('Ошибка добавления пользователя:', error);
            alert(error.reason || 'Ошибка добавления пользователя');
          }
        }
      },
      onRemoveUser: async (chatId: number) => {
        const login = prompt('Введите логин пользователя:');
        if (login) {
          try {
            const userId = parseInt(login, 10);
            if (!isNaN(userId)) {
              await this.chatsAPI.removeUsersFromChat([userId], chatId);
              alert('Пользователь успешно удален из чата');
            } else {
              alert('Неверный формат ID пользователя');
            }
          } catch (error: any) {
            console.error('Ошибка удаления пользователя:', error);
            alert(error.reason || 'Ошибка удаления пользователя');
          }
        }
      },
    });

    this.children.chatHeader = new ChatHeader({
      avatar: this.props.selectedChat?.avatar || '',
      name: this.props.selectedChat?.name || 'Выберите чат',
      status: this.props.selectedChat?.status,
    });

    this.children.chatWindow = new ChatWindow({
      chat: this.props.selectedChat,
      currentUser: this.props.currentUser,
    });
  }

  componentDidMount() {
    console.log('ChatsPage смонтирован');
  }

  protected componentDidUpdate(oldProps: ChatsPageProps, newProps: ChatsPageProps): boolean {
    console.log('componentDidUpdate:', { oldProps, newProps });

    if (oldProps.selectedChat?.id !== newProps.selectedChat?.id) {
      console.log('selectedChat changed:', newProps.selectedChat);

      this.children.chatHeader.setProps({
        avatar: newProps.selectedChat?.avatar || '',
        name: newProps.selectedChat?.title || 'Выберите чат',
        status: 'online',
      });

      this.children.chatWindow.setProps({
        chat: newProps.selectedChat,
        currentUser: this.props.currentUser,
      });

      return true;
    }

    if (JSON.stringify(oldProps.chats) !== JSON.stringify(newProps.chats)) {
      console.log('chats changed:', newProps.chats);
      this.children.chatList.setProps({
        chats: newProps.chats,
        onChatClick: this.setSelectedChat.bind(this),
      });
      return true;
    }

    return false;
  }

  render() {
    console.log('ChatsPage render with props:', this.props);
    return this.compile(chatsPageTemplate, {
      ...this.props,
      children: this.children,
    });
  }
}
