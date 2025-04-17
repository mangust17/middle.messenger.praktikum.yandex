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
    });
  }

  protected init() {
    const chatItems: Record<string, ChatItem> = {};
    this.props.chats.forEach((chat, index) => {
      chatItems[`chat_${index}`] = new ChatItem({
        ...chat,
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
  }

  protected render() {
    const chatItems = this.props.chats.map((chat) => {
      const chatItem = new ChatItem({
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
      return chatItem.getContent()?.outerHTML;
    }).join('');

    return this.compile(chatListTemplate, {
      ...this.props,
      chatItems,
    });
  }
}
