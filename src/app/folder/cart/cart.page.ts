import { Component, OnInit, OnDestroy } from "@angular/core";
import { User } from "src/app/models/user.interface";
import { AuthService } from "src/app/services/auth.service";
import { Product } from "src/app/models/product.interface";
import { Subscription, from, empty } from "rxjs";
import { AlertController, LoadingController, ModalController } from "@ionic/angular";
import { ProductService } from "src/app/services/product.service";
import { filter, switchMap, map, tap } from "rxjs/operators";
import { Toast } from '@capacitor/core';
import { ToastService } from 'src/app/services/toast.service';
import { ModalComponent } from 'src/app/components/modal/modal.component';

@Component({
  selector: "app-cart",
  templateUrl: "./cart.page.html",
  styleUrls: ["./cart.page.scss"],
})
export class CartPage implements OnInit, OnDestroy {
  user: User;
  cartProducts: Product[] = [];
  total = 0;
  userSub: Subscription;

  constructor(
    private authService: AuthService,
    private productsService: ProductService,
    private loadingCtrl: LoadingController,
    private toast: ToastService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.authService
      .getCurrentUser()
      .pipe(
        filter((user) => !!user),
        tap((user) => (this.user = user)),
        switchMap((user) => from(user.cart)),
        switchMap((product) => this.productsService.getProduct(product.ref.id)),
        switchMap((p) => {
          if (!p.name) {
            this.user.cart.filter((pro) => pro.ref.id !== p.id);
            return this.productsService.removeProductFromCart(p.id, true);
          } else if (
            this.cartProducts.findIndex((pro) => pro.name === p.name) < 0
          ) {
            this.cartProducts.push(p);
            this.calculateTotal();
            return empty();
          }
        })
      )
      .subscribe();
    // this.userSub = this.authService.getCurrentUser().subscribe((user) => {
    //   this.user = user;
    //   this.user.cart.forEach((product) => {
    //     this.productsService.getProduct(product.ref.id).subscribe((p) => {
    //       if (!p.name) {
    //         this.user.cart.filter((pro) => pro.ref !== product.ref);
    //         this.productsService.removeProductFromCart(product.ref.id, true);
    //       } else if (
    //         this.cartProducts.findIndex((pro) => pro.name === p.name) < 0
    //       ) {
    //         this.cartProducts.push(p);
    //         this.calculateTotal();
    //       }
    //     });
    //   });
    // });
  }

  checkout() {
    this.loadingCtrl
      .create({
        message: "Generando factura",
      })
      .then((load) => {
        load.present();
        this.productsService
          .checkoutProducts(
            this.cartProducts.map((x) => ({
              name: x.name,
              quantity: this.user.cart[
                this.user.cart.findIndex((prod) => prod.ref.id === x.id)
              ].quantity,
              total:
                this.user.cart[
                  this.user.cart.findIndex((prod) => prod.ref.id === x.id)
                ].quantity * x.price,
            }))
          )
          .subscribe(
            (res) => {
              console.log(res);
              this.modalCtrl.create({
                component: ModalComponent,
                componentProps: {
                  pdf: res
                }
              }).then(modal => {
                modal.present();
              })
              load.dismiss();
            },
            (err) => {
              console.log(err);
              this.toast.show("Ha ocurrido un error.");
            }
          );
      });
  }

  addOneToCart(product: Product) {
    this.productsService.addProductToCart(product).subscribe((res) => {
      this.user.cart[
        this.user.cart.findIndex((p) => p.ref.id === product.id)
      ].quantity += 1;
      this.calculateTotal();
    });
  }

  removeOneFromCart(product: Product) {
    const prodIndex = this.user.cart.findIndex((p) => p.ref.id === product.id);
    this.user.cart[prodIndex].quantity -= 1;
    if (this.user.cart[prodIndex].quantity === 0) {
      this.user.cart.splice(prodIndex, 1);
      this.cartProducts.splice(
        this.cartProducts.findIndex((p) => p.id === product.id),
        1
      );
    }
    this.productsService
      .removeProductFromCart(product.id)
      .subscribe((res) => this.calculateTotal());
  }

  removeFromCart(product: Product) {
    const prodIndex = this.user.cart.findIndex((p) => p.ref.id === product.id);
    this.user.cart[prodIndex].quantity = 0;
    if (this.user.cart[prodIndex].quantity === 0) {
      this.user.cart.splice(prodIndex, 1);
      this.cartProducts.splice(
        this.cartProducts.findIndex((p) => p.id === product.id),
        1
      );
    }
    this.productsService
      .removeProductFromCart(product.id, true)
      .subscribe((res) => this.calculateTotal());
  }

  helperCheck(product) {
    return (p) => p.ref.id === product.id;
  }

  calculateTotal() {
    this.total = 0;
    this.cartProducts.forEach((p) => {
      this.total +=
        this.user.cart[this.user.cart.findIndex((prod) => prod.ref.id === p.id)]
          .quantity * p.price;
    });
  }

  ngOnDestroy() {
    // this.userSub.unsubscribe();
  }
}
