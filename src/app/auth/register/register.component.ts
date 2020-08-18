import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { NavController } from '@ionic/angular';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private nav: NavController
  ) {}

  loading: boolean = false;
  form: FormGroup;

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: new FormControl('', [Validators.email, Validators.required]),
      lastName: new FormControl('', [
        Validators.maxLength(30),
        Validators.required,
      ]),
      username: new FormControl('', [
        Validators.maxLength(30),
        Validators.required,
      ]),
      firstName: new FormControl('', [
        Validators.maxLength(30),
        Validators.required,
      ]),
      password: new FormControl('', [
        Validators.maxLength(20),
        Validators.required,
      ]),
      isDriver: new FormControl(false),
    });
    this.subIsDriverControl();
  }

  subIsDriverControl() {
    this.form.get('isDriver').valueChanges.pipe(
      tap((val) => {
        if (val) {
          this.form.addControl('idPicture', new FormControl('', Validators.required));
          this.form.addControl('platePicture', new FormControl('', Validators.required));
          this.form.addControl('vehicleColor', new FormControl('', Validators.required));
        } else{
          this.form.removeControl('idPicture');
          this.form.removeControl('platePicture');
          this.form.removeControl('vehicleColor');
        }
      })
    ).subscribe();
  }

  createUser() {
    this.loading = true;
    this.authService.registerWithEmailAndPass(this.form.value).subscribe(() => {
      this.loading = false;
      this.nav.navigateRoot('/home/folder/stablishments');
    });
  }

  onImagePicked(formControl: string, image: string, url = false) {
    this.form.patchValue({ [formControl]: image });
  }
}
