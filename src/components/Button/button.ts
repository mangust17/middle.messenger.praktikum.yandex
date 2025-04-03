import Block from '../../core/block';
import buttonTemplate from './button.hbs?raw';

interface ButtonProps {
  id: string;
  text?: string;
  icon?: string;
  onClick?: (e: Event) => void;
  disabled?: boolean;
}

export default class Button extends Block<ButtonProps> {
  constructor(props: ButtonProps) {
    super({
      ...props,
      id: props.id,
      text: props.text,
      icon: props.icon,
      events: {
        click: props.onClick,
      },
    });
    this.addEvents();
  }

  protected addEvents(): void {
    if (this.props.onClick) {
      this.element?.addEventListener('click', this.props.onClick!);
    }
  }

  protected render() {
    const props = {
      ...this.props,
      style: 'cursor: pointer; z-index: 1000; position: relative;',
    };
    return this.compile(buttonTemplate, props);
  }
}
