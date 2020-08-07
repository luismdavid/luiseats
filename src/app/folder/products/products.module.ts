import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductsPageRoutingModule } from './products-routing.module';

import { ProductsPage } from './products.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { EditProductComponent } from './edit-product/edit-product.component';
import { ExploreProductsComponent } from './explore-products/explore-products.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ProductsPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ProductsPage, EditProductComponent, ExploreProductsComponent]
})
export class ProductsPageModule {}
