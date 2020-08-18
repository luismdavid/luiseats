import { DocumentReference } from '@angular/fire/firestore';

export interface ChatModel {
  id?: string;
  name: string;
  user: DocumentReference;
}
