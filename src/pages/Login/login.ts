import Block from '../../core/block';
import router from '../../core/router';
import loginTemplate from './login.hbs?raw';
import { Button } from '../../components/Button';
import { Link } from '../../components/Link';
import { VALIDATION_RULES, validateField } from '../../utils/validation';
import { AuthAPI } from '../../core/api/auth_api';
import store from '../../core/store';

export default class LoginPage extends Block {
  private authAPI: AuthAPI;

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

    this.authAPI = new AuthAPI();
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
      onClick: async (e: Event) => {
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
          login: formData.get('login') as string,
          password: formData.get('password') as string,
        };

        try {
          const response = await this.authAPI.signin(loginData);
          console.log('Ответ от сервера:', response);

          const userData = await this.authAPI.getUser();
          console.log('Данные пользователя:', userData);

          store.set('user', userData);
          router.go('/messenger');
        } catch (e: any) {
          console.error('Ошибка входа:', e);
          let errorResponse;
          try {
            errorResponse = JSON.parse(e.response);
          } catch (parseError) {
            errorResponse = { message: 'Невалидный Json', original: e.response };
          }

          if (errorResponse.reason === 'User already in system') {
            router.go('/messenger');
          } else {
            alert(errorResponse.reason || 'Ошибка входа');
          }
        }
      },
    });

    this.children.registerLink = new Link({
      href: '/sign-up',
      id: 'register-link',
      text: 'Нет аккаунта?',
      onClick: (e: Event) => {
        e.preventDefault();
        router.go('/sign-up');
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
