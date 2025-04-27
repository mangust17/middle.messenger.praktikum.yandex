import Block from '../../core/block';
import linkTemplate from './link.hbs?raw';
import router from '../../core/router';

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
        click: (e: Event) => {
          e.preventDefault();
          if (props.onClick) {
            props.onClick(e);
          }
          router.go(props.href);
        },
      },
    });
  }

  protected render() {
    return this.compile(linkTemplate, this.props);
  }
}
