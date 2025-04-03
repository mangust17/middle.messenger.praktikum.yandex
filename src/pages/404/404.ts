import Block from '../../core/block';
import template from './404.hbs?raw';
import router from '../../core/router';
import { Button } from '../../components/Button';

export default class Error_404 extends Block {
  constructor() {
    super({});
  }

  protected initChildren() {
    this.children.button = new Button({
      id: 'back_404',
      text: 'Вернуться на главную',
      onClick: (e: Event) => {
        e.preventDefault();
        console.log('На главную');
        router.back();
      },
    });
  }

  render() {
    return this.compile(template, { button: this.children.button });
  }
}
