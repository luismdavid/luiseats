import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  QueryDocumentSnapshot,
} from "@angular/fire/firestore";
import { map, first, switchMap } from "rxjs/operators";
import { Observable, from } from "rxjs";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFireStorage } from "@angular/fire/storage";
import uuid from "uuid/v4";
import { Stablishment } from "../models/stablishment.interface";

@Injectable({
  providedIn: "root",
})
export class StablishmentService {
  lastDoc: QueryDocumentSnapshot<Stablishment>;

  constructor(
    private firestore: AngularFirestore,
    private fAuth: AngularFireAuth,
    private storage: AngularFireStorage
  ) {}

  getAllStablishments(): Observable<Stablishment[]> {
    const stablishments = this.firestore
      .collection<Stablishment>("stablishments")
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
    return stablishments;
  }

  getStablishment(stablishmentId: string): Observable<Stablishment> {
    return this.firestore
      .collection("stablishments")
      .doc<Stablishment>(stablishmentId)
      .get()
      .pipe(
        map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            image: data.image,
            description: data.description,
            address: data.address,
            phoneNumber: data.phoneNumber,
          };
        })
      );
  }

  addNewStablishment(
    stablishment: Stablishment,
    url: boolean
  ): Observable<any> {
    if (url) {
      return from(
        this.firestore.collection<Stablishment>("stablishments").add({
          name: stablishment.name,
          description: stablishment.description,
          address: stablishment.address,
          image: stablishment.image,
          phoneNumber: stablishment.phoneNumber,
        })
      );
    }
    const formattedImage = stablishment.image.replace(
      "data:image/jpeg;base64,",
      ""
    );
    const id = uuid();
    const imagePath = `stablishment-images/${id}.jpg`;
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
          this.firestore.collection("stablishments").doc<Stablishment>(id).set({
            name: stablishment.name,
            description: stablishment.description,
            address: stablishment.address,
            image: imageUrl,
            phoneNumber: stablishment.phoneNumber,
          })
        );
      }),
      first()
    );
  }

  deleteStablishment(stablishment: Stablishment) {
    return from(
      this.firestore
        .collection("stablishments")
        .doc<Stablishment>(stablishment.id)
        .delete()
    ).pipe(
      first(),
      switchMap(() => {
        return this.storage
          .storage.refFromURL(stablishment.image)
          .delete();
      })
    );
  }

  modifyStablishment(
    stablishment: Stablishment,
    oldImageUrl: string,
    url: boolean = false
  ): Observable<any> {
    if (!oldImageUrl) {
      return from(
        this.firestore
          .collection("stablishments")
          .doc<Stablishment>(stablishment.id)
          .update({
            name: stablishment.name,
            description: stablishment.description,
            address: stablishment.address,
            image: stablishment.image,
            phoneNumber: stablishment.phoneNumber,
          })
      ).pipe(first());
    }
    if (url) {
      return from(
        this.firestore.collection("stablishments").doc<Stablishment>(stablishment.id).update({
          name: stablishment.name,
          description: stablishment.description,
          address: stablishment.address,
          image: stablishment.image,
          phoneNumber: stablishment.phoneNumber,
        })
      );
    }
    const formattedImage = stablishment.image.replace(
      "data:image/jpeg;base64,",
      ""
    );
    const id = uuid();
    const imagePath = `stablishment-images/${id}.jpg`;
    return from(
      this.storage
        .ref("")
        .child(imagePath)
        .putString(formattedImage, "base64", {
          contentType: "image/jpeg",
        })
    ).pipe(
      first(),
      switchMap(() =>
        this.storage.storage.refFromURL(oldImageUrl).delete()
      ),
      switchMap((res) => this.storage.ref(imagePath).getDownloadURL()),
      first(),
      switchMap((imageUrl) => {
        return from(
          this.firestore.collection("stablishments").doc<Stablishment>(stablishment.id).update({
            name: stablishment.name,
            description: stablishment.description,
            address: stablishment.address,
            image: imageUrl,
            phoneNumber: stablishment.phoneNumber,
          })
        );
      }),
      first()
    );
  }
}