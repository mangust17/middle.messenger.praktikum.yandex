type Listener<T extends any[] = any[]> = (...args: T) => void;

export class EventBus<Events extends Record<string, any[]>> {
  private listeners: { [K in keyof Events]?: Listener<Events[K]>[] } = {};

  on<K extends keyof Events>(event: K, callback: Listener<Events[K]>): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(callback);
  }

  off<K extends keyof Events>(event: K, callback: Listener<Events[K]>): void {
    if (!this.listeners[event]) {
      throw new Error(`Нет события: ${String(event)}`);
    }

    this.listeners[event] = this.listeners[event]!.filter(listener => listener !== callback);
  }

  emit<K extends keyof Events>(event: K, ...args: Events[K]): void {
    if (!this.listeners[event]) {
      throw new Error(`Нет события: ${String(event)}`);
    }

    this.listeners[event]!.forEach(listener => listener(...args));
  }
}
