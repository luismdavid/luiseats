import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { tap } from "rxjs/operators";
import { Product } from "src/app/models/product.interface";
import { LoadingController, NavController } from '@ionic/angular';
import { ToastService } from 'src/app/services/toast.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: "app-edit-product",
  templateUrl: "./edit-product.component.html",
  styleUrls: ["./edit-product.component.scss"],
})
export class EditProductComponent implements OnInit {
  loading: boolean = false;
  form: FormGroup;
  product: Product;
  isImageUrl: boolean = false;
  isImageChanged: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private nav: NavController,
    private loadCtrl: LoadingController,
    private toast: ToastService,
    private productService: ProductService
  ) {}

  ngOnInit() {
    const productId = this.activatedRoute.snapshot.paramMap.get("id");
    console.log(productId)
    this.form = this.formBuilder.group({
      id: new FormControl("", Validators.required),
      image: new FormControl("", Validators.required),
      name: new FormControl("", Validators.required),
      price: new FormControl("", [Validators.required, Validators.min(5)]),
      stablishmentId: new FormControl("", Validators.required)
    });
    this.loadCtrl
      .create({
        message: "Cargando establecimiento...",
      })
      .then((load) => {
        load.present();
        this.productService.getProduct(productId).pipe(
          tap((product) => {
            this.product = product;
            this.form.reset(product);
            load.dismiss();
          })
        ).subscribe();
      });
  }

  onImagePicked(image: string, url = false) {
    this.isImageUrl = url;
    this.isImageChanged = this.product.image;
    this.form.patchValue({ image });
  }

  updateProduct() {
    this.loading = true;
    this.productService
      .modifyProduct(
        this.form.value,
        this.isImageChanged,
        this.isImageUrl
      )
      .subscribe(
        () => {
          this.toast.show("Producto modificado con exito");
          this.loading = false;
        },
        (err) => {
          console.error(err);
          this.toast.show("Error al modificar el product");
          this.loading = false;
        }
      );
  }

  deleteProduct() {
    this.loading = true;
    this.productService.deleteProduct(this.product).subscribe(
      () => {
        this.loading = false;
        this.toast.show("Producto Eliminado con exito");
        this.nav.back();
      },
      (err) => {
        this.loading = false;
        console.error(err);
        this.toast.show("Error al eliminar el Establecimiento");
      }
    );
  }
}
