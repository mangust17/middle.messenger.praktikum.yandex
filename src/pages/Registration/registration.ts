import Block from '../../core/block';
import regTemplate from './registration.hbs?raw';
import router from '../../core/router';
import { Button } from '../../components/Button';
import { VALIDATION_RULES, validateField } from '../../utils/validation';

export default class RegistrationPage extends Block {
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
            console.log('Форма регистрации валидна');
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
    input.classList.add('error');
  }

  private hideError(input: HTMLInputElement): void {
    const errorSpan = input.nextElementSibling as HTMLElement;
    if (errorSpan && errorSpan.classList.contains('error-message')) {
      errorSpan.style.display = 'none';
    }
    input.classList.remove('error');
  }

  private validateForm(): boolean {
    const inputs = {
      name: this.element?.querySelector('input[name="first_name"]') as HTMLInputElement,
      login: this.element?.querySelector('input[name="login"]') as HTMLInputElement,
      email: this.element?.querySelector('input[name="email"]') as HTMLInputElement,
      password: this.element?.querySelector('input[name="password"]') as HTMLInputElement,
      phone: this.element?.querySelector('input[name="phone"]') as HTMLInputElement,
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
      id: 'sign-up',
      text: 'Зарегистрироваться',
      onClick: (e: Event) => {
        e.preventDefault();
        const form = document.getElementById('registration-form') as HTMLFormElement;
        if (!form) {
          console.error('Форма не найдена');
          return;
        }

        if (!this.validateForm()) {
          console.error('Форма содержит ошибки');
          return;
        }

        const formData = new FormData(form);
        const registrationData = {
          email: formData.get('email'),
          login: formData.get('login'),
          first_name: formData.get('first_name'),
          second_name: formData.get('second_name'),
          phone: formData.get('phone'),
          password: formData.get('password'),
          confirm_password: formData.get('confirm_password'),
        };

        if (registrationData.password !== registrationData.confirm_password) {
          console.error('Пароли не совпадают');
          return;
        }

        console.log('Данные для регистрации:', registrationData);
        router.go('/chats');
      },
    });
  }

  render() {
    return this.compile(regTemplate, { button: this.children.button });
  }
}
