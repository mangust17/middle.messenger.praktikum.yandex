import { Block } from "../core/Block";

interface ButtonProps {
  id: string;
  text: string;
  onClick?: () => void;
  [key: string]: any;
}

export class Button extends Block<ButtonProps> {
  constructor(props: ButtonProps) {
    super("button", props);
    this.element.textContent = props.text; // Устанавливаем текст кнопки
    this.element.id = props.id; // Устанавливаем id кнопки
    this.addEvents(); // Устанавливаем события для кнопки
  }

  protected addEvents(): void {
    if (this.props.onClick) {
      this.element.addEventListener("click", this.props.onClick);
    }
  }

  protected render(): string {
    return this.props.text; // Возвращаем текст для рендеринга
  }
}