import { BaseAPI } from './base_api';
import { API_CONST } from '../../utils/api_const';

export class AuthAPI extends BaseAPI {
  constructor() {
    super(API_CONST.BASE_URL);
  }

  signin(data: { login: string; password: string }) {
    return this.post('/auth/signin', {
      data,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  signup(data: { first_name: string; second_name: string; login: string; email: string; phone: string; password: string }) {
    return this.post('/auth/signup', {
      data,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  logout() {
    return this.post('/auth/logout', {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async getUser() {
    const response = (await this.get('/auth/user')) as XMLHttpRequest;

    try {
      return JSON.parse(response.responseText);
    } catch (err) {
      console.error('Ошибка парсинга JSON в getUser:', err, response.responseText);
      return null;
    }
  }
}
