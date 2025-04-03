import Block from '../../core/block';
import router from '../../core/router';
import loginTemplate from './login.hbs?raw';
import { Button } from '../../components/Button';
import { Link } from '../../components/Link';
import { VALIDATION_RULES, validateField } from '../../utils/validation';

export default class LoginPage extends Block {
  constructor() {
    super({
      events: {
        'blur input': (e: FocusEvent) => {
          const input = e.target as HTMLInputElement;
          const error = validateField(input.value, input.name as keyof typeof VALIDATION_RULES);
          if (error) {
            this.showError(input, error);
          } else {
            this.hideError(input);
          }
        },
        'submit form': (e: SubmitEvent) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const inputs = form.querySelectorAll('input');
          let isValid = true;

          inputs.forEach(input => {
            const error = validateField(input.value, input.name as keyof typeof VALIDATION_RULES);
            if (error) {
              this.showError(input, error);
              isValid = false;
            }
          });

          if (isValid) {
            console.log('Форма логина валидна');
          }
        },
      },
    });
  }

  private showError(input: HTMLInputElement, errorMessage: string): void {
    let errorSpan = input.nextElementSibling as HTMLElement;

    if (!errorSpan || !errorSpan.classList.contains('error-message')) {
      errorSpan = document.createElement('span');
      errorSpan.classList.add('error-message');
      input.insertAdjacentElement('afterend', errorSpan);
    }

    errorSpan.textContent = errorMessage;
    errorSpan.style.display = 'block';
  }

  private hideError(input: HTMLInputElement): void {
    const errorSpan = input.nextElementSibling as HTMLElement;
    if (errorSpan && errorSpan.classList.contains('error-message')) {
      errorSpan.style.display = 'none';
    }
  }

  private validateForm(): boolean {
    const inputs = {
      login: this.element?.querySelector('input[name="login"]') as HTMLInputElement,
      password: this.element?.querySelector('input[name="password"]') as HTMLInputElement,
    };

    let isValid = true;

    Object.entries(inputs).forEach(([validationKey, input]) => {
      if (!input) return;

      const rule = validationKey as keyof typeof VALIDATION_RULES;
      const error = validateField(input.value, rule);

      if (error) {
        this.showError(input, error);
        isValid = false;
      }
    });

    return isValid;
  }

  protected initChildren() {
    this.children.button = new Button({
      id: 'sign-in',
      text: 'Войти',
      onClick: (e: Event) => {
        e.preventDefault();
        const form = document.getElementById('login-form') as HTMLFormElement;
        if (!form) {
          console.error('Форма не найдена');
          return;
        }

        if (!this.validateForm()) {
          console.error('Форма содержит ошибки');
          return;
        }

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
