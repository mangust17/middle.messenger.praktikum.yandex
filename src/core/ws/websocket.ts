import { API_CONST } from '../../utils/api_const';

export class WebSocketService {
  private socket: WebSocket | null = null;
  private pingInterval: number | null = null;
  private readonly PING_INTERVAL = 30000;

  constructor(private chatId: number, private token: string, private userId: number) {
    console.log('Создание WebSocketService:', {
      chatId,
      userId,
      hasToken: !!token
    });
    this.connect();
  }

  private connect() {
    const url = `${API_CONST.BASE_SOCKET_URL}${this.userId}/${this.chatId}/${this.token}`;
    console.log('Попытка подключения к WebSocket:', url);

    this.socket = new WebSocket(url);

    this.socket.addEventListener('open', () => {
      console.log('WebSocket соединение успешно установлено');
      this.startPing();
      this.getOldMessages(0);
    });

    this.socket.addEventListener('close', (event) => {
      console.log('WebSocket соединение закрыто:', {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean
      });
      this.stopPing();
      console.log('Попытка переподключения через 5 секунд...');
      setTimeout(() => this.connect(), 5000);
    });

    this.socket.addEventListener('error', (event) => {
      console.error('WebSocket ошибка:', event);
    });
  }

  private startPing() {
    console.log('Запуск ping-интервала');
    this.pingInterval = window.setInterval(() => {
      if (this.socket?.readyState === WebSocket.OPEN) {
        console.log('Отправка ping сообщения');
        this.socket.send(JSON.stringify({ type: 'ping' }));
      } else {
        console.log('WebSocket не в состоянии OPEN, пропуск ping');
      }
    }, this.PING_INTERVAL);
  }

  private stopPing() {
    if (this.pingInterval) {
      console.log('Остановка ping-интервала');
      window.clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  public sendMessage(content: string) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      console.log('Отправка сообщения:', {
        content,
        type: 'message',
        socketState: this.socket.readyState
      });
      this.socket.send(JSON.stringify({
        content,
        type: 'message'
      }));
    } else {
      console.error('Невозможно отправить сообщение, WebSocket не в состоянии OPEN:', {
        socketState: this.socket?.readyState
      });
    }
  }

  public getOldMessages(offset: number = 0) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      console.log('Запрос старых сообщений:', {
        offset,
        socketState: this.socket.readyState
      });
      this.socket.send(JSON.stringify({
        content: offset.toString(),
        type: 'get old'
      }));
    } else {
      console.error('Невозможно запросить старые сообщения, WebSocket не в состоянии OPEN:', {
        socketState: this.socket?.readyState
      });
    }
  }

  public onMessage(callback: (data: any) => void) {
    if (this.socket) {
      console.log('Установка обработчика сообщений WebSocket');
      this.socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        if (data.type !== 'pong') {
          console.log('Получено сообщение от сервера:', data);
          callback(data);
        } else {
          console.log('Получен pong от сервера');
        }
      });
    } else {
      console.error('Невозможно установить обработчик сообщений, WebSocket не инициализирован');
    }
  }

  public close() {
    console.log('Закрытие WebSocket соединения');
    this.stopPing();
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}
