import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { map, tap, first, switchMap } from 'rxjs/operators';
import { Message, FileMessage } from '../models/message.interface';
import { v4 as uuid } from 'uuid';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  createMessage(message: Message, files: File[] = []): Observable<any> {
    if (files.length === 1) {
      const id = uuid();
      const path = `${message.chat.id}/${uuid()}.${
        files[0].name.split('.')[1]
      }`;
      return from(
        this.storage.ref('').child(path).put(files[0], {
          contentType: files[0].type,
        })
      ).pipe(
        first(),
        switchMap((res) => {
          return this.storage.ref(path).getDownloadURL();
        }),
        first(),
        switchMap((url) => {
          message.files = [
            {
              url,
              type: files[0].type,
              icon: 'file-text-outline',
            },
          ];
          return from(
            this.firestore
              .collection<Message>('messages')
              .doc(message.id)
              .set(message)
          );
        })
      );
    }
    return from(
      this.firestore
        .collection<Message>('messages')
        .doc(message.id)
        .set(message)
    );
  }

  getMessagesByChat(chatId: string): Observable<Message[]> {
    console.log(chatId);
    return from(
      this.firestore
        .collection<Message>('messages', (ref) =>
          ref.where('chat', '==', this.firestore.doc(`chats/` + chatId).ref)
        )
        .snapshotChanges()
    ).pipe(
      map(
        (actions) =>
          actions.map((x) => {
            const data = x.payload.doc.data();
            const id = x.payload.doc.id;
            return {
              ...data,
              date: (data.date as any).toDate(),
              id,
            };
          }),
        tap((s) => console.log(s))
      )
    );
  }
}
