import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { ExploreSkeletonComponent } from "./explore-skeleton/explore-skeleton.component";
import { ImagePickerComponent } from "./image-picker/image-picker.component";
import { ProductComponent } from "./product/product.component";
import { MapModalComponent } from "./map-modal/map-modal.component";
import { LocationPickerComponent } from "./location-picker/location-picker.component";

@NgModule({
  declarations: [
    ExploreSkeletonComponent,
    ImagePickerComponent,
    ProductComponent,
    MapModalComponent,
    LocationPickerComponent,
  ],
  imports: [CommonModule, IonicModule],
  providers: [],
  exports: [
    ExploreSkeletonComponent,
    ImagePickerComponent,
    ProductComponent,
    MapModalComponent,
    LocationPickerComponent,
  ],
})
export class ComponentsModule {}
