import Block from '../../core/block';
import linkTemplate from './link.hbs?raw';

interface LinkProps {
  href: string;
  id: string;
  text: string;
  class?: string;
  onClick?: (e: Event) => void;
}

export default class Link extends Block<LinkProps> {
  constructor(props: LinkProps) {
    super({
      ...props,
      events: {
        click: props.onClick,
      },
    });
  }

  protected render() {
    return this.compile(linkTemplate, this.props);
  }
}
