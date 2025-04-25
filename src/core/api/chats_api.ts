import { BaseAPI } from './base_api';
import { API_CONST } from '../../utils/api_const';

export class ChatsAPI extends BaseAPI {
  constructor() {
    super(API_CONST.BASE_URL);
  }

  getChats() {
    return this.get('/chats', {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  createChat(title: string) {
    return this.post('/chats', {
      data: { title },
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getChatUsers(chatId: number) {
    return this.get(`/chats/${chatId}/users`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getChatToken(chatId: number) {
    return this.post(`/chats/token/${chatId}`, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    });
  }

  addUserToChat(userId: number, chatId: number) {
    return this.put('/chats/users', {
      data: { users: [userId], chatId },
      headers: { 'Content-Type': 'application/json' },
    });
  }

  removeUserFromChat(userId: number, chatId: number) {
    return this.delete('/chats/users', {
      data: { users: [userId], chatId },
      headers: { 'Content-Type': 'application/json' },
    });
  }

  searchUsers(login: string) {
    return this.post('/user/search', {
      data: { login },
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
