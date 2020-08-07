import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ExploreSkeletonComponent } from './explore-skeleton/explore-skeleton.component';
import { ImagePickerComponent } from './image-picker/image-picker.component';
import { ProductComponent } from './product/product.component';


@NgModule({
  declarations: [ExploreSkeletonComponent, ImagePickerComponent, ProductComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  providers: [],
  exports: [ExploreSkeletonComponent, ImagePickerComponent, ProductComponent]
})
export class ComponentsModule { }
