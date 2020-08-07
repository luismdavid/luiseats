import { Injectable } from "@angular/core";
import { from, Observable } from "rxjs";
import { Product } from "../models/product.interface";
import { first, switchMap, map } from "rxjs/operators";
import { AngularFireStorage } from "@angular/fire/storage";
import { AngularFirestore } from "@angular/fire/firestore";
import { AuthService } from "./auth.service";
import { User } from "../models/user.interface";
import uuid from "uuid/v4";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  private currentUser: User;

  constructor(
    private storage: AngularFireStorage,
    private firestore: AngularFirestore,
    private authService: AuthService,
    private http: HttpClient
  ) {
    this.authService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
    });
  }

  getProductsByStablishment(stablishmentId: string): Observable<Product[]> {
    return this.firestore
      .collection<Product>("products", (ref) =>
        ref.where("stablishmentId", "==", stablishmentId)
      )
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  addProductToCart(product: Product) {
    const userDoc = this.firestore.doc(`users/${this.currentUser.id}`);
    return userDoc.get().pipe(
      map((doc) => {
        const cart = doc.data().cart;
        const index = cart.findIndex((prod) => prod.ref.id === product.id);
        const prodDoc = this.firestore
          .collection("products")
          .doc<Product>(product.id);
        const toUpdate = cart.find((prod) => prod.ref.id === product.id);
        let newP = false;
        if (index < 0) {
          newP = true;
          cart.push({ quantity: 1, ref: prodDoc.ref });
        } else {
          toUpdate.quantity += 1;
          cart[index] = toUpdate;
        }
        userDoc.update({ cart });
        if (newP) {
          return { quantity: 1, ref: prodDoc.ref };
        }
        return { quantity: toUpdate.quantity, ref: prodDoc.ref };
      }),
      first()
    );
  }

  removeProductFromCart(productId: string, whole = false) {
    const userDoc = this.firestore.doc<User>(`users/${this.currentUser.id}`);
    return userDoc.get().pipe(
      switchMap((doc) => {
        const cart = doc.data().cart;
        const index = cart.findIndex((prod) => prod.ref.id === productId);
        cart[index].quantity -= 1;
        if (cart[index].quantity === 0 || whole) {
          cart.splice(index, 1);
        }
        return userDoc.update({ cart });
      }),
      first()
    );
  }

  deleteProduct(product: Product) {
    return from(
      this.firestore.collection("products").doc<Product>(product.id).delete()
    ).pipe(
      first(),
      switchMap(() => {
        return this.storage.storage.refFromURL(product.image).delete();
      })
    );
  }

  getProduct(productId: string): Observable<Product> {
    return from(
      this.firestore
        .collection("products")
        .doc<Product>(productId)
        .get()
        .pipe(
          map((doc) => {
            const data = doc.data();
            return {
              ...data,
              id: doc.id,
            } as Product;
          })
        )
    );
  }

  modifyProduct(
    product: Product,
    oldImageUrl: string,
    url: boolean = false
  ): Observable<any> {
    if (!oldImageUrl) {
      return from(
        this.firestore.collection("products").doc<Product>(product.id).update({
          name: product.name,
          price: product.price,
        })
      ).pipe(first());
    }
    if (url) {
      return from(
        this.firestore.collection("products").doc<Product>(product.id).update({
          name: product.name,
          image: product.image,
          price: product.price,
        })
      );
    }
    const formattedImage = product.image.replace("data:image/jpeg;base64,", "");
    const imagePath = `product-images/${product.id}.jpg`;
    return from(
      this.storage
        .ref("")
        .child(imagePath)
        .putString(formattedImage, "base64", {
          contentType: "image/jpeg",
        })
    ).pipe(
      first(),
      switchMap(() => this.storage.storage.refFromURL(oldImageUrl).delete()),
      switchMap((res) => this.storage.ref(imagePath).getDownloadURL()),
      first(),
      switchMap((imageUrl) => {
        return from(
          this.firestore
            .collection("products")
            .doc<Product>(product.id)
            .update({
              name: product.name,
              image: imageUrl,
              price: product.price,
            })
        );
      }),
      first()
    );
  }

  addProduct(product: Product, url: boolean): Observable<any> {
    if (url) {
      return from(this.firestore.collection<Product>("products").add(product));
    }
    const formattedImage = product.image.replace("data:image/jpeg;base64,", "");
    const id = uuid();
    const imagePath = `product-images/${id}.jpg`;
    return from(
      this.storage
        .ref("")
        .child(imagePath)
        .putString(formattedImage, "base64", {
          contentType: "image/jpeg",
        })
    ).pipe(
      first(),
      switchMap((res) => {
        return this.storage.ref(imagePath).getDownloadURL();
      }),
      first(),
      switchMap((imageUrl) => {
        return from(
          this.firestore
            .collection("products")
            .doc<Product>(id)
            .set({
              ...product,
              creatorEmail: this.currentUser.email,
              image: imageUrl,
            })
        );
      }),
      first()
    );
  }

  checkoutProducts(products: any[]): Observable<any> {
    let toSend = {
      user: {
        email: this.currentUser.email,
        name: this.currentUser.firstName + " " + this.currentUser.lastName,
        phoneNumber: this.currentUser.username,
      },
      items: products,
    };
    const pdfPath = `bills/${this.currentUser.id}/${uuid()}.pdf`;
    return this.http
      .post("http://ig-web2-2.herokuapp.com/genPDF", toSend, {
        responseType: "blob",
      })
      .pipe(
        switchMap((blob: Blob) =>
          this.storage
            .ref(pdfPath)
            .put(blob, {
              contentType: 'application/pdf'
            })
        ),
        first(),
        switchMap(() => this.storage.ref(pdfPath).getDownloadURL()),
        first()
      );
  }
}
