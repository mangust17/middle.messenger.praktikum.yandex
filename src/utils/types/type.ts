export interface Message {
  text: string;
  isMine: boolean;
  time?: string;
}

export interface Chat {
  id: number;
  avatar: string | null;
  name: string;
  lastMessage?: string;
  unreadCount: number;
  messages: Message[];
  status?: string;
  created_by: number;
  title: string;
  last_message: {
    user: {
      first_name: string;
      second_name: string;
      avatar: string;
      email: string;
      login: string;
      phone: string;
    };
    time: string;
    content: string;
  } | null;
  token?: string;
}
