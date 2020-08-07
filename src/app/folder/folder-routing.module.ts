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
        path: 'products/:stablishmentId',
        loadChildren: () => import('./products/products.module').then(m => m.ProductsPageModule)
      },
      {
        path: 'stablishments',
        component: StablishmentsComponent,
        pathMatch: 'full'
      },
      {
        path: 'stablishments/:id',
        component: EditStablishmentComponent
      },
      {
        path: 'cart',
        loadChildren: () => import('./cart/cart.module').then(m => m.CartPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FolderPageRoutingModule {}
