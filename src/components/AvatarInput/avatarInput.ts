import Block from '../../core/block';
import template from './avatarInput.hbs?raw';
import { UserAPI } from '../../core/api/user_api';
import store from '../../core/store';

export default class AvatarInput extends Block {
  private userAPI = new UserAPI();

  constructor() {
    super({
      events: {
        change: async (e: Event) => this.handleChange(e),
      },
    });
  }

  async handleChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await this.userAPI.updateAvatar(formData);
      console.log('Аватар обновлён:', response);
      store.set('user', response);
      alert('Аватар успешно обновлён');
    } catch (error: any) {
      console.error('Ошибка при обновлении аватара:', error);
      alert(error.reason || 'Ошибка обновления аватара');
    }
  }

  render() {
    return this.compile(template, {});
  }
}
