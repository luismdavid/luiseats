import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FolderPage } from './folder.page';
import { StablishmentsComponent } from './stablishments/stablishments.component';
import { EditStablishmentComponent } from './stablishments/edit-stablishment/edit-stablishment.component';

const routes: Routes = [
  {
    path: '',
    component: FolderPage,
    children: [
      {
        path: 'stablishments',
        component: StablishmentsComponent,
        pathMatch: 'full'
      },
      {
        path: 'stablishments/:id',
        component: EditStablishmentComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FolderPageRoutingModule {}
