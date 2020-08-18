import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FolderPageRoutingModule } from './folder-routing.module';

import { FolderPage } from './folder.page';
import { StablishmentsComponent } from './stablishments/stablishments.component';
import { ComponentsModule } from '../components/components.module';
import { EditStablishmentComponent } from './stablishments/edit-stablishment/edit-stablishment.component';
import { CartPageModule } from './cart/cart.module';
import { ChatsPage } from './chats/chats.page';
import { NbChatModule, NbSpinnerModule, NbUserModule, NbCardModule } from '@nebular/theme';
import { ChatMiniComponent } from './chats/chat-mini/chat-mini.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    FolderPageRoutingModule,
    ComponentsModule,
    NbUserModule,
    NbCardModule
  ],
  declarations: [FolderPage, StablishmentsComponent, EditStablishmentComponent, ChatsPage, ChatMiniComponent]
})
export class FolderPageModule {}
