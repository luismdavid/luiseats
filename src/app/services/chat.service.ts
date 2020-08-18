import { Injectable } from '@angular/core';
import { from, of, Observable, zip } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { User } from '../models/user.interface';
import { map, tap, mergeMap, filter, switchMap } from 'rxjs/operators';
import { ChatModel } from '../models/chat.interface';
import { Conversation } from '../models/conversation.interface';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private currentUser: User;
  public otherUser: User;

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService
  ) {
    this.authService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
    });
  }

  getChatsByUser(): Observable<Conversation[]> {
    let currentUser;
    return this.authService.getCurrentUser().pipe(
      filter((user) => !!user),
      map((user) => {
        currentUser = user;
        return user.chats;
      }),
      mergeMap((chats) => {
        if (chats.length === 0) {
          return of([]);
        }
        return zip(...chats.map((c) => this.getChatById(c.ref.id)));
      }),
      mergeMap((chats) =>
        this.firestore
          .collection<ChatModel>('chats', (ref) =>
            ref.where(
              'user',
              '==',
              this.firestore.doc(`users/` + currentUser.id).ref
            )
          )
          .snapshotChanges()
          .pipe(
            map((actions) =>
              actions.map(
                (x) =>
                  ({
                    ...x.payload.doc.data(),
                    id: x.payload.doc.id,
                  } as ChatModel)
              )
            ),
            tap((moreChats) => chats.push(...moreChats.filter(x => !chats.includes(x) && !chats.find(a => a.id === x.id)))),
            switchMap(() => {
              if (chats.length === 0) {
                return of([]);
              }
              return zip(
                ...chats.map((x) =>
                  this.authService.getUserById(x.user.id).pipe(
                    map(
                      (user) =>
                        ({
                          chat: x,
                          messages: [],
                          user,
                        } as Conversation)
                    )
                  )
                )
              );
            })
          )
      ),
      tap((s) => {
        console.log(s);
      })
    );
  }

  createChat(user: User, chatId: string): Observable<any> {
    const id: string = chatId;
    const chat = {
      name: 'Chat with ' + user.username,
      user: this.firestore.doc(`users/${user.id}`).ref,
      id: id,
    } as ChatModel;

    this.currentUser.chats.push({
      ref: this.firestore.doc(`chats/` + id).ref,
      user: this.firestore.doc(`users/` + user.id).ref,
    });
    return from(this.firestore.doc(`chats/` + id).set(chat)).pipe(
      switchMap(() =>
        from(
          this.firestore
            .doc(`users/` + this.currentUser.id)
            .update(this.currentUser)
        )
      )
    );
  }

  getChatById(chatId: string): Observable<ChatModel> {
    return from(
      this.firestore.doc<ChatModel>(`chats/${chatId}`).snapshotChanges()
    ).pipe(
      map((a) => {
        const data = a.payload.data();
        const id = a.payload.id;
        return { id, ...data } as ChatModel;
      })
    );
  }
}
