export interface Message {
  text: string;
  isMine: boolean;
  time?: string;
}

export interface Chat {
  avatar: string;
  name: string;
  lastMessage?: string;
  unreadCount: number;
  messages: Message[];
  status?: string;
}
