import Block from '../../core/block';
import chatWindowTemplate from './chatWindow.hbs?raw';
import { Chat } from '../../utils/types/type';
import { User } from '../../utils/types/user';
import ChatSidebar from '../ChatSidebar/chatSidebar';
import { WebSocketService } from '../../core/api/websocket';
import store from '../../core/store';
import { AuthAPI } from '../../core/api/auth_api';
import './chatWindow.pcss';

interface ChatWindowProps {
  chat?: Chat;
  currentUser?: User;
  onAddUser?: () => void;
  onRemoveUser?: () => void;
  onChangeAvatar?: () => void;
}

export default class ChatWindow extends Block<ChatWindowProps> {
  private wsService: WebSocketService | null = null;
  private authAPI: AuthAPI;

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

    this.authAPI = new AuthAPI();
    this.checkAuth();
  }

  private async checkAuth() {
    try {
      const userData = await this.authAPI.getUser();
      console.log('Данные пользователя получены в ChatWindow:', userData);
      store.set('user', userData);
      this.setProps({ currentUser: userData });
    } catch (error) {
      console.error('Ошибка авторизации в ChatWindow:', error);
    }
  }

  protected componentDidMount() {
    console.log('ChatWindow mounted');
    this.initEventListeners();
  }

  private initEventListeners() {
    console.log('Initializing event listeners');

    // Используем setTimeout для гарантии, что DOM полностью загружен
    setTimeout(() => {
      const form = this.getContent()?.querySelector('#message-form');
      const input = this.getContent()?.querySelector('#message-input') as HTMLInputElement;
      const button = this.getContent()?.querySelector('.send-button');

      console.log('DOM elements:', { form, input, button });

      if (!form || !input || !button) {
        console.error('Не удалось найти элементы формы');
        return;
      }

      // Обработчик для кнопки
      button.addEventListener('click', (event) => {
        console.log('Button clicked');
        event.preventDefault();
        this.handleMessageSend(input);
      });

      // Обработчик для формы
      form.addEventListener('submit', (event) => {
        console.log('Form submitted');
        event.preventDefault();
        this.handleMessageSend(input);
      });

      // Обработчик для Enter
      input.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
          console.log('Enter pressed');
          event.preventDefault();
          this.handleMessageSend(input);
        }
      });
    }, 0);
  }

  private handleMessageSend(input: HTMLInputElement) {
    console.log('Handling message send:', {
      message: input.value,
      wsService: this.wsService ? 'exists' : 'null',
      chat: this.props.chat ? {
        id: this.props.chat.id,
        hasToken: !!this.props.chat.token
      } : 'null'
    });

    if (input?.value.trim() && this.wsService) {
      console.log('Отправка сообщения через WebSocket:', input.value);
      this.wsService.sendMessage(input.value);
      input.value = '';
    } else {
      console.log('WebSocket не инициализирован или сообщение пустое', {
        hasWsService: !!this.wsService,
        hasMessage: !!input?.value.trim(),
        chat: this.props.chat ? {
          id: this.props.chat.id,
          hasToken: !!this.props.chat.token
        } : 'null'
      });
    }
  }

  protected componentDidUpdate(oldProps: ChatWindowProps, newProps: ChatWindowProps): boolean {
    console.log('ChatWindow componentDidUpdate:', {
      oldChatId: oldProps.chat?.id,
      newChatId: newProps.chat?.id,
      oldHasToken: !!oldProps.chat?.token,
      newHasToken: !!newProps.chat?.token,
      hasWsService: !!this.wsService
    });

    if (this.children.chatSidebar) {
      this.children.chatSidebar.setProps({
        chat: newProps.chat,
      });
    }

    // Проверяем, что у нас есть новый чат с токеном
    if (newProps.chat?.id && newProps.chat?.token) {
      // Если это новый чат, или изменился токен, или WebSocket еще не инициализирован
      if (!this.wsService || oldProps.chat?.id !== newProps.chat.id || oldProps.chat?.token !== newProps.chat.token) {
        console.log('Инициализация WebSocket для чата:', {
          chatId: newProps.chat.id,
          hasToken: !!newProps.chat.token,
          currentWsService: !!this.wsService
        });
        this.initWebSocket(newProps.chat);
      }
    } else {
      console.log('Невозможно инициализировать WebSocket: отсутствует чат или токен');
    }

    // Переинициализируем обработчики событий после обновления
    this.initEventListeners();

    return true;
  }

  private initWebSocket(chat: Chat) {
    console.log('Начало инициализации WebSocket:', {
      chatId: chat.id,
      hasToken: !!chat.token,
      currentState: this.wsService ? 'exists' : 'null'
    });

    // Закрываем предыдущее соединение, если оно есть
    if (this.wsService) {
      console.log('Закрытие предыдущего WebSocket соединения');
      this.wsService.close();
      this.wsService = null;
    }

    // Получаем ID пользователя из store или из props
    const userId = store.getState().user?.id || this.props.currentUser?.id;
    console.log('Получение ID пользователя:', {
      fromStore: store.getState().user?.id,
      fromProps: this.props.currentUser?.id,
      finalUserId: userId
    });

    if (!userId) {
      console.error('User ID не найден ни в store, ни в props');
      return;
    }

    if (!chat.token) {
      console.error('Токен чата не найден');
      return;
    }

    console.log('Создание нового WebSocket соединения:', {
      chatId: chat.id,
      userId,
      token: chat.token
    });

    try {
      this.wsService = new WebSocketService(chat.id, chat.token, userId);
      this.wsService.onMessage((data) => {
        if (Array.isArray(data)) {
          store.set('messages', data.reverse());
        } else if (data.type === 'message') {
          store.set('messages.', data);
        }

        const state = store.getState();
        const rawMessages = state.messages;
        const messages = Array.isArray(rawMessages) ? rawMessages : [];

        this.setProps({
          chat: {
            ...this.props.chat,
            messages: messages.map((msg: any) => ({
              text: msg.content,
              time: msg.time ? new Date(msg.time).toLocaleTimeString() : 'только что',
              isMine: msg.user_id === state.user?.id,
            })),
          }
        });
      });
    } catch (error) {
      console.error('Ошибка при создании WebSocketService:', error);
    }
  }

  protected render() {
    const state = store.getState();
    const rawMessages = state.messages;
    const messages = Array.isArray(rawMessages) ? rawMessages : [];
    const currentUser = state.user;

    return this.compile(chatWindowTemplate, {
      chat: {
        id: this.props.chat?.id,
        avatar: this.props.chat?.avatar,
        messages: messages.map((msg: any) => ({
          text: msg.content,
          time: msg.time ? new Date(msg.time).toLocaleTimeString() : 'только что',
          isMine: msg.user_id === currentUser?.id,
        })),
      },
      currentUser: currentUser,
      chatSidebar: this.children.chatSidebar,
    });
  }




  public componentWillUnmount() {
    if (this.wsService) {
      this.wsService.close();
    }
  }
}
