import { Component, OnInit } from '@angular/core';
import { tap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { MessageService } from 'src/app/services/message.service';
import { Message } from 'src/app/models/message.interface';
import { User } from 'src/app/models/user.interface';
import { Conversation } from 'src/app/models/conversation.interface';
import { ChatModel } from 'src/app/models/chat.interface';

@Component({
  selector: 'app-actual-chat',
  templateUrl: './actual-chat.page.html',
  styleUrls: ['./actual-chat.page.scss'],
})
export class ActualChatPage implements OnInit {
  loading: boolean = true;
  sendMessageAction: (string) => void;
  messages: Message[] = [];
  chatUser: User;
  chat: ChatModel;
  currentUser: User;

  constructor(
    private activatedRoute: ActivatedRoute,
    private chatService: ChatService,
    private authService: AuthService,
    private firestore: AngularFirestore,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams
      .pipe(
        tap((query) => {
          this.chatUser = this.chatService.otherUser;
          this.sendMessageAction = this.sendNewMessage;
        }),
        switchMap(() => this.authService.getCurrentUser()),
        tap((user) => (this.currentUser = user)),
        switchMap(() => this.activatedRoute.params),
        switchMap((params) => {
          this.loading = true;
          return this.chatService.getChatById(params.id);
        }),
        switchMap((chat) => {
          this.chat = chat;
          return this.authService.getUserById(chat.user.id).pipe(
            tap((user) => (this.chatUser = user)),
            switchMap(() =>
              this.messageService.getMessagesByChat(this.chat.id)
            ),
            tap((messages) => {
              this.messages.push(
                ...messages.filter(
                  (x) => !this.messages.find((a) => a.id === x.id)
                )
              );
              this.messages = this.messages.sort(
                (a, b) => a.date.getTime() - b.date.getTime()
              );
              console.log(this.messages);
              this.loading = false;
            })
          );
        })
      )
      .subscribe();
  }

  
  

  sendNewMessage(contents: {
    files: any[];
    message: string;
  }) {
    const message: Message = {
      id: uuid(),
      chat: this.firestore.doc(`chats/` + this.chat.id).ref,
      date: new Date(),
      sender: this.currentUser.username,
      text: contents.message,
      type: contents.files.length > 0 ? 'file' : 'text',
      user: this.currentUser.id,
    };
    console.log(contents.files);
    this.messageService.createMessage(message, contents.files).subscribe();
  }
}
