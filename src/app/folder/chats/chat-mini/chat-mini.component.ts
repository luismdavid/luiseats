import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/models/user.interface';
import { ChatModel } from 'src/app/models/chat.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat-mini',
  templateUrl: './chat-mini.component.html',
  styleUrls: ['./chat-mini.component.scss'],
})
export class ChatMiniComponent implements OnInit {
  @Input() user: User;
  @Input() chat: ChatModel;
  @Input() lastMessage: string;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  clicked() {
    this.router.navigate(['/chats/contact/' + this.chat.id]);
  }
}
