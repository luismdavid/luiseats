import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { StablishmentService } from "src/app/services/stablishment.service";
import { Stablishment } from "src/app/models/stablishment.interface";
import { LoadingController, ToastController, NavController } from "@ionic/angular";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: "app-edit-stablishment",
  templateUrl: "./edit-stablishment.component.html",
  styleUrls: ["./edit-stablishment.component.scss"],
})
export class EditStablishmentComponent implements OnInit {
  public stablishment: Stablishment;
  public form: FormGroup;
  loading: boolean = false;
  private isImageChanged: string;
  private isImageUrl: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private stablishmentService: StablishmentService,
    private loadCtrl: LoadingController,
    private formBuilder: FormBuilder,
    private toast: ToastService,
    private nav: NavController
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: new FormControl("", Validators.required),
      description: new FormControl("", Validators.required),
      address: new FormControl("", Validators.required),
      phoneNumber: new FormControl("", Validators.required),
      image: new FormControl("", Validators.required),
    });
    this.loadCtrl
      .create({
        message: "Cargando establecimiento...",
      })
      .then((load) => {
        load.present();
        const id = this.activatedRoute.snapshot.paramMap.get("id");
        this.stablishmentService.getStablishment(id).subscribe((stab) => {
          this.stablishment = stab;
          this.form.reset(stab);
          load.dismiss();
        });
      });
  }

  updateStablishment() {
    this.loading = true;
    this.stablishmentService
      .modifyStablishment(
        {
          id: this.stablishment.id,
          ...this.form.value,
        },
        this.isImageChanged,
        this.isImageUrl
      )
      .subscribe(
        () => {
          this.toast.show("Establecimiento modificado con exito");
          this.loading = false;
        },
        (err) => {
          console.error(err);
          this.toast.show("Error al modificar el product");
          this.loading = false;
        }
      );
  }

  deleteStablishment() {
    this.loading = true;
    this.stablishmentService.deleteStablishment(this.stablishment).subscribe(
      () => {
        this.loading = false;
        this.toast.show("Establecimiento Eliminado con exito");
        this.nav.back();
      },
      (err) => {
        this.loading = false;
        console.error(err);
        this.toast.show("Error al eliminar el Establecimiento");
      }
    );
  }

  onImagePicked(image: string, url = false) {
    this.isImageUrl = url;
    this.isImageChanged = this.stablishment.image;
    this.form.patchValue({ image });
  }
}
