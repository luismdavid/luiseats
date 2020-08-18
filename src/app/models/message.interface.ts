import { DocumentReference } from "@angular/fire/firestore";
export interface FileMessage {
  url: string;
  icon: string;
  type: string;
}


export interface Message {
  id?: string;
  type: string;
  text: string;
  sender: string;
  date: Date;
  files?: FileMessage[];
  chat: DocumentReference;
  user: string;
}
