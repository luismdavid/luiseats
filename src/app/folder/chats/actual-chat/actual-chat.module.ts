import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActualChatPageRoutingModule } from './actual-chat-routing.module';

import { ActualChatPage } from './actual-chat.page';
import { NbChatModule, NbSpinnerModule } from '@nebular/theme';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NbSpinnerModule,
    IonicModule,
    NbChatModule,
    ActualChatPageRoutingModule,
  ],
  declarations: [ActualChatPage]
})
export class ActualChatPageModule {}
