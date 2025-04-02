import Block from '../../core/block';
import router from '../../core/router';
import loginTemplate from './login.hbs?raw';
import { Button } from '../../components/Button';
import { Link } from '../../components/Link';

export default class LoginPage extends Block {
  constructor() {
    super({});
  }

  protected initChildren() {
    this.children.button = new Button({
      id: 'sign-in',
      text: 'Войти',
      onClick(e: Event) {
        e.preventDefault();
        const form = document.getElementById('login-form') as HTMLFormElement;
        if (!form) {
          console.error('Форма не найдена');
          return;
        }

        const errorMessages = form.querySelectorAll('.error-message');
        errorMessages.forEach(error => error.remove());

        const formData = new FormData(form);
        const loginData = {
          login: formData.get('login'),
          password: formData.get('password'),
        };

        console.log('Данные для входа:', loginData);
        router.go('/chats');
      },
    });

    this.children.registerLink = new Link({
      href: '/register',
      id: 'register-link',
      text: 'Нет аккаунта?',
      onClick: (e: Event) => {
        e.preventDefault();
        router.go('/register');
      },
    });
  }

  render() {
    return this.compile(loginTemplate, {
      button: this.children.button.getContent()?.outerHTML || '',
      link: this.children.registerLink.getContent()?.outerHTML || '',
    });
  }
}
