import { Message } from "./message.interface";
import { User } from './user.interface';
import { ChatModel } from './chat.interface'

export interface Conversation {
  chat: ChatModel;
  user: User;
  messages: Message[];
}
