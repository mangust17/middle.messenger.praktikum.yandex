import Block from '../../core/block';
import chatHeaderTemplate from './chatHeader.hbs?raw';
import './chatHeader.pcss';

interface ChatHeaderProps {
  avatar: string;
  name: string;
  status?: string;
}

export default class ChatHeader extends Block<ChatHeaderProps> {
  constructor(props: ChatHeaderProps) {
    super(props);
  }

  protected render() {
    return this.compile(chatHeaderTemplate, this.props);
  }
}
