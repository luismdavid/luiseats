import { Component, OnInit } from "@angular/core";
import { Stablishment } from "src/app/models/stablishment.interface";
import { Product } from "src/app/models/product.interface";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { StablishmentService } from "src/app/services/stablishment.service";
import { LoadingController } from "@ionic/angular";
import { ToastService } from "src/app/services/toast.service";
import { zip, from } from "rxjs";
import { filter, tap, switchMap } from "rxjs/operators";
import { User } from "src/app/models/user.interface";
import { ProductService } from "src/app/services/product.service";

@Component({
  selector: "app-explore-products",
  templateUrl: "./explore-products.component.html",
  styleUrls: ["./explore-products.component.scss"],
})
export class ExploreProductsComponent implements OnInit {
  loading: boolean = false;
  creating: boolean = false;
  stablishment: Stablishment;
  products: Product[] = [];
  form: FormGroup;
  currentUser: User;
  isImageUrl: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private stablishmentService: StablishmentService,
    private productService: ProductService,
    private loadCtrl: LoadingController,
    private toast: ToastService
  ) {}

  ngOnInit() {
    const stabId = this.activatedRoute.snapshot.paramMap.get("stablishmentId");
    console.log(stabId);
    this.loading = true;
    this.form = this.formBuilder.group({
      name: new FormControl("", Validators.required),
      price: new FormControl("", [Validators.required, Validators.min(5)]),
      image: new FormControl("", Validators.required),
      stablishmentId: new FormControl(stabId, Validators.required),
    });
    this.loadCtrl
      .create({
        message: "Cargando...",
      })
      .then((load) => {
        load.present();
        zip(
          this.authService.getCurrentUser().pipe(
            filter((user) => !!user),
            tap((user) => (this.currentUser = user)),
            switchMap(() =>
              this.stablishmentService
                .getStablishment(stabId)
                .pipe(tap((stab) => (this.stablishment = stab)))
            )
          ),
          this.productService
            .getProductsByStablishment(stabId)
            .pipe(tap((products) => (this.products = products)))
        ).subscribe(() => {
          load.dismiss();
          this.loading = false;
        });
      });
  }

  onCartAdd(product: Product) {
    this.productService.addProductToCart(product).subscribe(() => {
      this.toast.show("El producto ha sido agregado al carrito con exito.");
    }, err => {
      this.toast.show("Ha ocurrido un error al agregar el producto al carrito.");
    });
  }

  onImagePicked(image: string, url = false) {
    this.isImageUrl = url;
    this.form.patchValue({ image });
  }

  addNewProduct() {
    from(
      this.loadCtrl.create({
        message: "Creando producto...",
      })
    )
      .pipe(
        switchMap((load) => {
          load.present();
          return this.productService
            .addProduct(this.form.value, this.isImageUrl)
            .pipe(
              tap(() => {
                load.dismiss();
                this.toast.show("Producto agregado con exito");
                this.form.reset();
                this.creating = false;
              })
            );
        })
      )
      .subscribe();
  }
}
