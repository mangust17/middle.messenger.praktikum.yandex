import Block from '../../core/block';
import chatListTemplate from './chatList.hbs?raw';
import { Chat } from '../../utils/types/type';
import ChatItem from '../ChatItem/chatItem';
import Button from '../Button/button';
import './chatList.pcss';

interface ChatListProps {
  chats: Chat[];
  onCreateChat?: (title: string) => void;
  onAddUser?: (chatId: number) => void;
  onRemoveUser?: (chatId: number) => void;
  onChatClick?: (chatId: number) => void;
}

interface ChatListState {
  createChatButton: Button;
  chatItems: Record<string, ChatItem>;
}

export default class ChatList extends Block<ChatListProps, ChatListState> {
  constructor(props: ChatListProps) {
    super({
      ...props,
      createChatButton: new Button({
        id: 'createChatButton',
        text: 'Создать чат',
        onClick: () => {
          const title = prompt('Введите название чата:');
          if (title && props.onCreateChat) {
            props.onCreateChat(title);
          }
        },
      }),
      chatItems: {},
    });
  }

  protected componentDidUpdate(oldProps: ChatListProps, newProps: ChatListProps): boolean {
    if (JSON.stringify(oldProps.chats) !== JSON.stringify(newProps.chats)) {
      this.initChatItems();
      return true;
    }
    return false;
  }

  private initChatItems() {
    const chatItems: Record<string, ChatItem> = {};

    if (!this.props.chats) {
      console.warn('chats is undefined');
      return;
    }

    this.props.chats.forEach((chat, index) => {
      chatItems[`chat_${index}`] = new ChatItem({
        ...chat,
        name: chat.title,
        onClick: () => {
          if (this.props.onChatClick) {
            this.props.onChatClick(chat.id);
          }
        },
        onAddUser: () => {
          if (this.props.onAddUser) {
            this.props.onAddUser(chat.id);
          }
        },
        onRemoveUser: () => {
          if (this.props.onRemoveUser) {
            this.props.onRemoveUser(chat.id);
          }
        },
      });
    });
    this.state.chatItems = chatItems;
    this.children = { ...this.children, ...chatItems };
  }

  protected init() {
    this.initChatItems();
  }

  protected render() {
    return this.compile(chatListTemplate, {
      ...this.props,
      chatItems: Object.values(this.state.chatItems)
        .map(item => {
          this.children[item._id] = item;
          return `<div data-id="id-${item._id}"></div>`;
        })
        .join(''),
    });
  }
}
