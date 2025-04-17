import { BaseAPI } from './base_api';
import { API_CONST } from '../../utils/api_const';

export class ChatsAPI extends BaseAPI {
  constructor() {
    super(API_CONST.BASE_URL);
  }

  createChat(data: { title: string }) {
    return this.post('/chats', {
      data,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getChats() {
    return this.get('/chats');
  }

  getChatToken(chatId: number) {
    return this.post(`/chats/token/${chatId}`);
  }

  addUsersToChat(users: number[], chatId: number) {
    return this.put('/chats/users', {
      data: { users, chatId },
      headers: { 'Content-Type': 'application/json' }
    });
  }

  removeUsersFromChat(users: number[], chatId: number) {
    return this.delete('/chats/users', {
      data: { users, chatId },
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
