import Block from '../../core/block';
import router from '../../core/router';
import { Button } from '../../components/Button';
import chatsPageTemplate from './chats.hbs?raw';
import { ChatList } from '../../components/ChatList';
import { ChatHeader } from '../../components/ChatHeader';
import { ChatWindow } from '../../components/ChatWindow';
import { Chat } from '../../types/type';
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
  constructor(props?: Partial<ChatsPageProps>) {
    super({
      chats: [
        {
          avatar: '/avatars/avatar1.jpg',
          name: 'Андрей',
          lastMessage: 'Привет!',
          unreadCount: 2,
          status: 'В сети',
          messages: [
            { text: 'Привет!', isMine: false },
            { text: 'Как дела?', isMine: true },
            { text: 'Все хорошо, как ты?', isMine: false },
          ],
        },
        {
          avatar: '/avatars/avatar2.jpg',
          name: 'Киноклуб',
          lastMessage: 'Какой...',
          unreadCount: 1,
          status: 'Оффлайн',
          messages: [
            { text: 'Какой фильм смотрим?', isMine: false },
            { text: 'Давайте посмотрим новый боевик', isMine: true },
          ],
        },
      ],
      currentUser: { avatar: '/avatars/avatar3.jpg', name: 'Ванек' },
      settingsButton: new Button({
        id: 'settings-btn',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gear" viewBox="0 0 16 16">
            <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
            <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.319.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
          </svg>`,
        onClick: () => router.go('/profile'),
      }),
      ...props,
    });
  }

  private setSelectedChat(chat: Chat) {
    console.log('Выбран чат:', chat);
    console.log('Доступные чаты:', this.props.chats);

    const selectedChat = this.props.chats.find(c => c.name === chat.name);
    console.log('Полные данные выбранного чата:', selectedChat);

    if (selectedChat) {
      console.log('Обновляем состояние с чатом:', selectedChat);

      this.setProps({
        selectedChat: selectedChat,
      });

      console.log('Обновляем компоненты');
      this.children.chatHeader.setProps({
        avatar: selectedChat.avatar,
        name: selectedChat.name,
        status: 'online',
      });

      console.log('Обновляем ChatWindow');
      this.children.chatWindow.setProps({
        chat: selectedChat,
        currentUser: this.props.currentUser,
      });
    } else {
      console.log('Чат не найден в списке чатов');
    }
  }

  protected initChildren() {
    console.log('Инициализация компонентов с props:', this.props);

    this.children.chatList = new ChatList({
      chats: this.props.chats,
      onChatClick: this.setSelectedChat.bind(this),
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
    console.log('Обновление компонентов:', {
      oldProps,
      newProps,
    });

    if (oldProps.selectedChat !== newProps.selectedChat) {
      console.log('Обновляем компоненты для выбранного чата:', newProps.selectedChat);
      this.children.chatHeader.setProps({
        avatar: newProps.selectedChat?.avatar,
        name: newProps.selectedChat?.name,
        status: newProps.selectedChat?.status,
      });

      this.children.chatWindow.setProps({
        chat: newProps.selectedChat,
        currentUser: this.props.currentUser,
      });
    }

    if (JSON.stringify(oldProps.chats) !== JSON.stringify(newProps.chats)) {
      console.log('Обновляем ChatList, так как изменились чаты');
      this.children.chatList.setProps({
        chats: newProps.chats,
        onChatClick: this.setSelectedChat.bind(this),
      });
    }

    return true;
  }

  render() {
    console.log('Рендер ChatsPage с props:', this.props);
    console.log('Дети компонента:', this.children);
    return this.compile(chatsPageTemplate, {
      ...this.props,
      children: this.children,
    });
  }
}
