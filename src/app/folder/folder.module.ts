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

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    FolderPageRoutingModule,
    ComponentsModule,
  ],
  declarations: [FolderPage, StablishmentsComponent, EditStablishmentComponent]
})
export class FolderPageModule {}
