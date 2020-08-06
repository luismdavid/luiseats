import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../models/user.interface';
import { map, first, switchMap, tap } from 'rxjs/operators';
import { of, from, BehaviorSubject, Subscription } from 'rxjs';
import * as firebase from 'firebase/app';
import 'firebase/auth';

interface RegisterValues {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

interface LoginValues {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private _user = new BehaviorSubject<User>(null);
  private userSub: Subscription;

  constructor(
    private fAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {
    this.userSub = this.getUserObservable().subscribe(user => {
      this._user.next(user);
    });
  }


  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  getCurrentUser() {
    return this._user.asObservable();
  }

  getUserObservable() {
    let userEmail: string;
    return this.fAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          userEmail = user.email;
          return this.firestore
            .doc<User>(`users/${user.uid}`)
            .snapshotChanges();
        } else {
          return of(null);
        }
      }),
      map(doc => {
        if (doc) {
          return { ...doc.payload.data(), email: userEmail } as User;
        }
      })
    );
  }

  registerWithEmailAndPass(values: RegisterValues) {
    return from(
      this.fAuth.createUserWithEmailAndPassword(
        values.email,
        values.password
      )
    ).pipe(
      switchMap(async res => {
        const userId = res.user.uid;
        if (userId) {
          const userDoc = this.firestore.doc<User>('users/' + userId);
          return userDoc.set({
            firstName: values.firstName,
            lastName: values.lastName,
            username: values.username,
            cart: [],
            isAdmin: false
          });
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