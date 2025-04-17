import { BaseAPI } from './base_api';
import { API_CONST } from '../../utils/api_const';

export class UserAPI extends BaseAPI {
  constructor() {
    super(API_CONST.BASE_URL);
  }

  updateProfile(data: {
    first_name: string;
    second_name: string;
    display_name: string;
    login: string;
    email: string;
    phone: string;
  }) {
    return this.put('/user/profile', {
      data,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  updateAvatar(form: FormData) {
    return this.put('/user/profile/avatar', {
      data: form
    });
  }

  updatePassword(data: { oldPassword: string; newPassword: string }) {
    return this.put('/user/password', {
      data,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  searchUser(login: string) {
    return this.post('/user/search', {
      data: { login },
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 