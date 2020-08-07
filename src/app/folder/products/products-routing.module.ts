import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ProductsPage } from "./products.page";
import { EditProductComponent } from "./edit-product/edit-product.component";
import { ExploreProductsComponent } from "./explore-products/explore-products.component";

const routes: Routes = [
  {
    path: "",
    component: ProductsPage,
  },
  {
    path: "explore",
    component: ExploreProductsComponent,
  },
  {
    path: "edit/:id",
    component: EditProductComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsPageRoutingModule {}
