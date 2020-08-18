import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.interface';
import { Message } from 'src/app/models/message.interface';
import { ChatModel } from 'src/app/models/chat.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';
import { MessageService } from 'src/app/services/message.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { tap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Conversation } from 'src/app/models/conversation.interface';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
})
export class ChatsPage implements OnInit {
  chatUser: User;
  currentUser: User;
  messages: Message[] = [];
  loading: boolean = true;
  chats: Conversation[] = [];

  constructor(
    private chatService: ChatService
  ) {}

  sendMessageAction: (contents) => void;

  ngOnInit(): void {
    this.chatService.getChatsByUser().subscribe((chats) => {
      this.loading = false;
      this.chats = chats;
    });
    
  }


}
