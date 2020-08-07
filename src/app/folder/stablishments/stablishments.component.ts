import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";
import { LoadingController, AlertController } from "@ionic/angular";
import { StablishmentService } from "src/app/services/stablishment.service";
import { ToastService } from "src/app/services/toast.service";
import { Stablishment } from "src/app/models/stablishment.interface";
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.interface';

@Component({
  selector: "app-stablishments",
  templateUrl: "./stablishments.component.html",
  styleUrls: ["./stablishments.component.scss"],
})
export class StablishmentsComponent implements OnInit {
  loading: boolean = false;
  creating: boolean = false;
  form: FormGroup;
  isImageUrl: boolean;
  stablishments: Stablishment[];
  currentUser: User;

  constructor(
    private formBuilder: FormBuilder,
    private loadCtrl: LoadingController,
    private stablishmentService: StablishmentService,
    private toast: ToastService,
    private alertCtrl: AlertController,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    })
    this.stablishmentService
      .getAllStablishments()
      .subscribe((stablishments) => {
        this.stablishments = stablishments;
      });

    this.form = this.formBuilder.group({
      name: new FormControl("", Validators.required),
      description: new FormControl("", Validators.required),
      address: new FormControl("", Validators.required),
      phoneNumber: new FormControl("", Validators.required),
      image: new FormControl("", Validators.required),
    });
  }

  addNewStablishment() {
    this.loadCtrl
      .create({
        message: "Creando Establecimiento...",
      })
      .then((load) => {
        load.present();
        this.stablishmentService
          .addNewStablishment(this.form.value, this.isImageUrl)
          .subscribe(
            (res) => {
              load.dismiss();
              this.form.reset();
              this.creating = false;
              this.toast.show("Nuevo Establecimiento agregado con exito");
            },
            (error) => {
              load.dismiss();
              console.log(error);
              this.alertCtrl
                .create({
                  header: "An error has ocurred.",
                  subHeader: "Please try again later.",
                  message: error,
                  buttons: ["OK"],
                })
                .then((alert) => alert.present());
            }
          );
      });
  }

  onImagePicked(image: string, url = false) {
    this.isImageUrl = url;
    this.form.patchValue({ image });
  }
}
