import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(private toast: ToastController) {}

  show(message: string) {
    this.toast
      .create({
        message,
        duration: 5000
      })
      .then(toast => toast.present());
  }
}
