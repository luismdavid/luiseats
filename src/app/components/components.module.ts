import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { ExploreSkeletonComponent } from "./explore-skeleton/explore-skeleton.component";
import { ImagePickerComponent } from "./image-picker/image-picker.component";
import { ProductComponent } from "./product/product.component";
import { MapModalComponent } from "./map-modal/map-modal.component";
import { LocationPickerComponent } from "./location-picker/location-picker.component";
import { ModalComponent } from "./modal/modal.component";
import { SafePipe } from '../pipes/safe.pipe';

@NgModule({
  declarations: [
    ExploreSkeletonComponent,
    ImagePickerComponent,
    ProductComponent,
    MapModalComponent,
    LocationPickerComponent,
    ModalComponent,
    SafePipe
  ],
  imports: [CommonModule, IonicModule],
  providers: [],
  exports: [
    ExploreSkeletonComponent,
    ImagePickerComponent,
    ProductComponent,
    MapModalComponent,
    LocationPickerComponent,
    ModalComponent,
    SafePipe
  ],
})
export class ComponentsModule {}
