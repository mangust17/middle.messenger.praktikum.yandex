import Block from '../../core/block';
import chatItemTemplate from './chatItem.hbs?raw';
import { Chat } from '../../utils/types/type';
import './chatItem.pcss';

interface ChatItemProps extends Chat {
  onClick: () => void;
  onAddUser?: () => void;
  onRemoveUser?: () => void;
}

export default class ChatItem extends Block<ChatItemProps> {
  constructor(props: ChatItemProps) {
    console.log('ChatItem constructor with props:', props);
    super({
      ...props,
      events: {
        click: (e: Event) => {
          e.preventDefault();
          console.log('ChatItem click event:', props.name);
          props.onClick();
        },
      },
    });
  }

  protected render() {
    console.log('ChatItem render with props:', this.props);
    return this.compile(chatItemTemplate, this.props);
  }
}
