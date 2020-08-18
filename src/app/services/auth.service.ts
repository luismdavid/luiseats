import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../models/user.interface';
import { map, first, switchMap, tap } from 'rxjs/operators';
import { of, from, BehaviorSubject, Subscription, Observable, zip } from 'rxjs';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { AngularFireStorage } from '@angular/fire/storage';

interface RegisterValues {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  isDriver?: boolean;
  idPicture: string;
  platePicture: string;
  vehicleColor: string;
}

interface LoginValues {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private _user = new BehaviorSubject<User>(null);
  private userSub: Subscription;

  constructor(
    private fAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) {
    this.userSub = this.getUserObservable().subscribe((user) => {
      this._user.next(user);
    });
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  getRandomDriver(): Observable<User> {
    return from(
      this.firestore
        .collection<User>('users', (ref) => ref.where('isDriver', '==', true))
        .snapshotChanges()
        .pipe(
          map((actions) =>
            actions.map((x) => {
              const data = x.payload.doc.data();
              const id = x.payload.doc.id;
              return {
                ...data,
                id,
              } as User;
            })
          ),
          map((users) => users[Math.round(Math.random() * users.length - 1)]),
          first()
        )
    );
  }

  getUserById(userId: string): Observable<User> {
    return from(this.firestore.doc<User>(`users/${userId}`).get()).pipe(
      map((x) => {
        const data = x.data();
        const id = x.id;
        return {
          ...data,
          id,
        } as User;
      })
    );
  }

  getCurrentUser() {
    return this._user.asObservable();
  }

  getUserObservable() {
    let userEmail: string;
    let userId: string;
    return this.fAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          userId = user.uid;
          userEmail = user.email;
          return this.firestore
            .doc<User>(`users/${user.uid}`)
            .snapshotChanges();
        } else {
          return of(null);
        }
      }),
      map((doc) => {
        if (doc) {
          return {
            ...doc.payload.data(),
            email: userEmail,
            id: userId,
          } as User;
        }
      })
    );
  }

  registerWithEmailAndPass(values: RegisterValues): Observable<any> {
    return from(
      this.fAuth.createUserWithEmailAndPassword(values.email, values.password)
    ).pipe(
      switchMap((res) => {
        const userId = res.user.uid;
        if (userId) {
          const userDoc = this.firestore.doc<User>('users/' + userId);
          if (values.isDriver) {
            let idPictureUrl = '';
            const formattedIdPicture = values.idPicture.replace(
              'data:image/jpeg;base64,',
              ''
            );
            const idPicturePath = `id-images/${userId}.jpg`;

            const formattedPlatePicture = values.platePicture.replace(
              'data:image/jpeg;base64,',
              ''
            );
            const platePicturePath = `plate-images/${userId}.jpg`;
            return from(
              this.storage
                .ref('')
                .child(idPicturePath)
                .putString(formattedIdPicture, 'base64', {
                  contentType: 'image/jpeg',
                })
            ).pipe(
              switchMap((res) =>
                this.storage.ref(idPicturePath).getDownloadURL()
              ),
              tap((idUrl) => {
                console.log(idUrl);
                idPictureUrl = idUrl;
              }),
              switchMap(() =>
                from(
                  this.storage
                    .ref('')
                    .child(platePicturePath)
                    .putString(formattedPlatePicture, 'base64', {
                      contentType: 'image/jpeg',
                    })
                ).pipe(
                  first(),
                  switchMap((res) =>
                    this.storage.ref(platePicturePath).getDownloadURL()
                  )
                )
              ),
              switchMap((plateUrl) => {
                console.log('aja hasta aqui llega');
                return userDoc.set({
                  firstName: values.firstName,
                  lastName: values.lastName,
                  username: values.username,
                  cart: [],
                  isAdmin: false,
                  chats: [],
                  isDriver: values.isDriver,
                  idPicture: idPictureUrl,
                  platePicture: plateUrl,
                  isVerified: false,
                  vehicleColor: values.vehicleColor,
                });
              })
            );
          } else {
            return userDoc.set({
              firstName: values.firstName,
              lastName: values.lastName,
              username: values.username,
              cart: [],
              isAdmin: false,
              chats: [],
              isDriver: values.isDriver,
            });
          }
        }
        return of(null);
      })
    );
  }

  loginWithEmailAndPass(values: LoginValues) {
    return from(
      this.fAuth.signInWithEmailAndPassword(values.email, values.password)
    ).pipe(first());
  }

  logoutUser() {
    return from(this.fAuth.signOut()).pipe(first());
  }
}
