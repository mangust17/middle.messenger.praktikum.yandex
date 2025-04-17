import Block from '../../core/block';
import router from '../../core/router';
import profileTemplate from './profile.hbs?raw';
import { Button } from '../../components/Button';
import { validateField } from '../../utils/validation';
import { UserAPI } from '../../core/api/user_api';
import { AuthAPI } from '../../core/api/auth_api';
import store from '../../core/store';

interface ProfilePageProps {
  user: {
    avatar: string;
    display_name: string;
    login: string;
    email: string;
    first_name: string;
    second_name: string;
    phone: string;
  };
}

export default class ProfilePage extends Block<ProfilePageProps & { showPasswordFields: boolean }> {
  private userAPI: UserAPI;
  private authAPI: AuthAPI;

  constructor(props: ProfilePageProps) {
    super({ ...props, showPasswordFields: false });
    this.userAPI = new UserAPI();
    this.authAPI = new AuthAPI();

    this.loadUserData();

    this.setProps({
      events: {
        'blur input': (e: FocusEvent) => {
          const input = e.target as HTMLInputElement;
          /* eslint-disable */
          const error = validateField(input.value, input.name as any);
          this.showError(input, error);
        },
        'submit form': async (e: SubmitEvent) => {
          e.preventDefault();
          if (!this.validateForm()) {
            console.error('Форма содержит ошибки');
            return;
          }

          const form = e.target as HTMLFormElement;
          const formData = new FormData(form);
          const profileData = {
            first_name: formData.get('first_name') as string,
            second_name: formData.get('second_name') as string,
            display_name: formData.get('display_name') as string,
            login: formData.get('login') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string,
          };

          try {
            const response = await this.userAPI.updateProfile(profileData);
            console.log('Профиль обновлен:', response);
            store.set('user', response);
            this.setProps({ user: response });
            alert('Данные успешно обновлены');
          } catch (error: any) {
            console.error('Ошибка обновления профиля:', error);
            alert(error.reason || 'Ошибка обновления профиля');
          }
        },
      },
    });
  }

  private async loadUserData() {
    try {
      const userData = await this.authAPI.getUser() as {
        id: number;
        first_name: string;
        second_name: string;
        display_name: string;
        login: string;
        email: string;
        phone: string;
        avatar: string | null;
      };
      
      console.log('Данные пользователя загружены:', userData);
      
      // Обновляем пропсы и принудительно перерисовываем компонент
      this.setProps({ 
        user: userData,
        showPasswordFields: this.props.showPasswordFields 
      });
      
      // Принудительно обновляем DOM
      const form = this.element?.querySelector('form');
      if (form) {
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
          const name = input.name;
          if (name && userData[name as keyof typeof userData]) {
            input.value = userData[name as keyof typeof userData] as string;
          }
        });
      }

      store.set('user', userData);
    } catch (error: any) {
      console.error('Ошибка загрузки данных пользователя:', error);
      alert(error.reason || 'Ошибка загрузки данных пользователя');
      router.go('/');
    }
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
      onClick: async (e: Event) => {
        e.preventDefault();
        if (this.validateForm()) {
          const form = this.element?.querySelector('form');
          if (form) {
            const formData = new FormData(form);
            const profileData = {
              first_name: formData.get('first_name') as string,
              second_name: formData.get('second_name') as string,
              display_name: formData.get('display_name') as string,
              login: formData.get('login') as string,
              email: formData.get('email') as string,
              phone: formData.get('phone') as string,
            };

            try {
              const response = await this.userAPI.updateProfile(profileData);
              console.log('Профиль обновлен:', response);
              store.set('user', response);
              alert('Данные успешно обновлены');
            } catch (error: any) {
              console.error('Ошибка обновления профиля:', error);
              alert(error.reason || 'Ошибка обновления профиля');
            }
          }
        }
      },
    });

    this.children.changePasswordButton = new Button({
      id: 'change-password',
      text: 'Изменить пароль',
      onClick: async (e: Event) => {
        e.preventDefault();
        if (this.props.showPasswordFields) {
          const form = this.element?.querySelector('form');
          if (form) {
            const oldPassword = form.querySelector('input[name="oldPassword"]') as HTMLInputElement;
            const newPassword = form.querySelector('input[name="newPassword"]') as HTMLInputElement;

            if (!oldPassword.value || !newPassword.value) {
              alert('Пожалуйста, заполните оба поля пароля');
              return;
            }

            // Валидация старого пароля
            const oldPasswordError = validateField(oldPassword.value, 'password');
            if (oldPasswordError) {
              this.showError(oldPassword, oldPasswordError);
              return;
            }

            // Валидация нового пароля
            const newPasswordError = validateField(newPassword.value, 'password');
            if (newPasswordError) {
              this.showError(newPassword, newPasswordError);
              return;
            }

            if (oldPassword.value === newPassword.value) {
              alert('Новый пароль должен отличаться от старого');
              return;
            }

            const passwordData = {
              oldPassword: oldPassword.value,
              newPassword: newPassword.value,
            };

            try {
              await this.userAPI.updatePassword(passwordData);
              alert('Пароль успешно изменен');
              this.togglePasswordFields();
              // Очищаем поля после успешного изменения
              oldPassword.value = '';
              newPassword.value = '';
            } catch (error: any) {
              console.error('Ошибка изменения пароля:', error);
              alert(error.reason || 'Ошибка изменения пароля');
            }
          }
        } else {
          this.togglePasswordFields();
        }
      },
    });

    this.children.logoutButton = new Button({
      id: 'logout',
      text: 'Выйти из аккаунта',
      onClick: async (e: Event) => {
        e.preventDefault();
        try {
          await this.authAPI.logout();
          store.set('user', null);
          router.go('/');
        } catch (error: any) {
          console.error('Ошибка выхода:', error);
          alert(error.reason || 'Ошибка выхода из аккаунта');
        }
      },
    });

    // Добавляем обработчик для изменения аватара
    const avatarInput = this.element?.querySelector('input[name="avatar"]') as HTMLInputElement;
    if (avatarInput) {
      avatarInput.addEventListener('change', async (e: Event) => {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
          const formData = new FormData();
          formData.append('avatar', file);

          try {
            const response = await this.userAPI.updateAvatar(formData);
            console.log('Аватар обновлен:', response);
            store.set('user', response);
            alert('Аватар успешно обновлен');
          } catch (error: any) {
            console.error('Ошибка обновления аватара:', error);
            alert(error.reason || 'Ошибка обновления аватара');
          }
        }
      });
    }
  }

  private togglePasswordFields() {
    const newShowPasswordFields = !this.props.showPasswordFields;

    this.setProps({
      showPasswordFields: newShowPasswordFields,
    });
    this.children.changePasswordButton.setProps({
      text: newShowPasswordFields ? 'Изменить пароль' : 'Изменить пароль',
    });
  }

  render() {
    const templateData = {
      ...this.props.user,
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
