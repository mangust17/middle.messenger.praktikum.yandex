import Block from '../../core/block';
import chatListTemplate from './chatList.hbs?raw';
import { ChatItem } from '../ChatItem';
import { Chat } from '../../types/type';
import Handlebars from 'handlebars';

interface ChatListProps {
  chats: Chat[];
  onChatClick: (chat: Chat) => void;
}

export default class ChatList extends Block<ChatListProps> {
  constructor(props: ChatListProps) {
    super({ ...props, chats: props.chats ?? [] });
    this.initChildren();
  }

  private handleClick = (chat: Chat) => {
    console.log(`Клик по чату ${chat.name}`);
    if (typeof this.props.onChatClick === 'function') {
      this.props.onChatClick(chat);
    } else {
      console.error('onChatClick is not a function:', this.props.onChatClick);
    }
  };

  protected initChildren() {
    this.children = {};

    if (!this.props.chats || !Array.isArray(this.props.chats)) {
      console.warn('ChatList: props.chats is not an array', this.props.chats);
      return;
    }

    this.props.chats.forEach((chat, index) => {
      console.log(`Создаем ChatItem для чата ${chat.name}`);
      this.children[`chat_${index}`] = new ChatItem({
        ...chat,
        onClick: () => this.handleClick(chat),
      });
    });
  }

  protected componentDidUpdate(oldProps: ChatListProps, newProps: ChatListProps): boolean {
    if (Array.isArray(newProps.chats) && oldProps.chats !== newProps.chats) {
      this.initChildren();
    }
    return true;
  }

  protected render() {
    const template = Handlebars.compile(chatListTemplate);
    const html = template({
      chatItems: this.props.chats.map((_, index) => `{{{chat_${index}}}}`).join('\n'),
    });
    return this.compile(html, {});
  }
}
