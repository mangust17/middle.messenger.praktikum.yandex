import Block from '../../core/block';
import router from '../../core/router';
import profileTemplate from './profile.hbs?raw';
import { Button } from '../../components/Button';
import { validateField } from '../../utils/validation';

interface ProfilePageProps {
  user: {
    avatar: string;
    display_name: string;
    login: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
}

export default class ProfilePage extends Block<ProfilePageProps & { showPasswordFields: boolean }> {
  constructor(props: ProfilePageProps) {
    super({ ...props, showPasswordFields: false });

    this.setProps({
      events: {
        'blur input': (e: FocusEvent) => {
          const input = e.target as HTMLInputElement;
          /* eslint-disable */
          const error = validateField(input.value, input.name as any);
          this.showError(input, error);
        },
        'submit form': (e: SubmitEvent) => {
          e.preventDefault();
          if (!this.validateForm()) {
            console.error('Форма содержит ошибки');
            return;
          }
          console.log('Измененные данные профиля отправлены!');
        },
      },
    });
  }

  private showError(input: HTMLInputElement, errorMessage: string | null): void {
    let errorSpan = input.nextElementSibling as HTMLElement;

    if (!errorSpan || !errorSpan.classList.contains('error-message')) {
      errorSpan = document.createElement('span');
      errorSpan.classList.add('error-message');
      input.insertAdjacentElement('afterend', errorSpan);
    }

    errorSpan.textContent = errorMessage ?? '';
    errorSpan.style.display = errorMessage ? 'block' : 'none';
  }

  private validateForm(): boolean {
    const inputs = this.element?.querySelectorAll('input');
    let isValid = true;

    inputs?.forEach(input => {
      const fieldName = input.name;
      if (fieldName === 'chat_name' || fieldName === 'avatar') {
        return;
      }
      const error = validateField(input.value, input.name as any);
      this.showError(input, error);
      if (error) isValid = false;
    });

    return isValid;
  }

  protected initChildren() {
    this.children.chatButton = new Button({
      id: 'chat_button',
      text: 'Назад',
      onClick: (e: Event) => {
        console.log('Кнопка назад нажата');
        e.preventDefault();
        router.back();
      },
    });

    this.children.editButton = new Button({
      id: 'edit-data',
      text: 'Изменить данные',
      onClick: (e: Event) => {
        e.preventDefault();
        if (this.validateForm()) {
          console.log('Данные профиля изменены!');
        }
      },
    });

    this.children.changePasswordButton = new Button({
      id: 'change-password',
      text: 'Изменить пароль',
      onClick: (e: Event) => {
        e.preventDefault();
        this.togglePasswordFields();
      },
    });

    this.children.logoutButton = new Button({
      id: 'logout',
      text: 'Выйти из аккаунта',
      onClick: (e: Event) => {
        e.preventDefault();
        console.log('Выход из аккаунта...');
      },
    });
  }

  private togglePasswordFields() {
    const newShowPasswordFields = !this.props.showPasswordFields;

    this.setProps({
      showPasswordFields: newShowPasswordFields,
    });
    this.children.changePasswordButton.setProps({
      text: newShowPasswordFields ? 'Не изменять пароль' : 'Изменить пароль',
    });
  }

  render() {
    const templateData = {
      ...userData,
      showPasswordFields: this.props.showPasswordFields,
      chat_button: this.children.chatButton.getContent()?.outerHTML,
      editButton: this.children.editButton.getContent()?.outerHTML,
      changePasswordButton: this.children.changePasswordButton.getContent()?.outerHTML,
      logoutButton: this.children.logoutButton.getContent()?.outerHTML,
    };

    return this.compile(profileTemplate, templateData);
  }
}
export const userData = {
  avatar: '/avatars/avatar3.jpg',
  login: 'user123',
  email: 'user@example.com',
  firstName: 'Иван',
  lastName: 'Иванов',
  chatName: 'IvanChat',
  phone: '+79991234567',
  password: 'password',
  display_name: 'Ванек',
};
