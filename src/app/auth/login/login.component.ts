import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";
import { AuthService } from "src/app/services/auth.service";
import { NavController } from "@ionic/angular";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private nav: NavController
  ) {}

  form: FormGroup;
  loading: boolean = false;
  ngOnInit() {
    this.form = this.formBuilder.group({
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [
        Validators.required,
        Validators.maxLength(20),
      ]),
    });
  }

  loginUser() {
    this.loading = true;
    this.authService.loginWithEmailAndPass(this.form.value).subscribe(
      () => {
        this.loading = false;
        this.nav.navigateRoot("/home/folder/stablishments");
      },
      (err) => {
        this.loading = false;
      }
    );
  }
}
