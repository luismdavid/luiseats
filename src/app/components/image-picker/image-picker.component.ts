import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  Input,
} from "@angular/core";
import { Plugins, CameraResultType, CameraSource } from "@capacitor/core";
const { Camera } = Plugins;
import {
  ActionSheetController,
  Platform,
  AlertController,
} from "@ionic/angular";

@Component({
  selector: "app-image-picker",
  templateUrl: "./image-picker.component.html",
  styleUrls: ["./image-picker.component.scss"],
})
export class ImagePickerComponent implements OnInit {
  @Output() imagePicked = new EventEmitter<string>();
  @Output() urlPicked = new EventEmitter<string>();
  @ViewChild("filePicker", { static: false }) filePickerRef: ElementRef;
  @Input() showPreview = false;
  @Input() selectedImage: string;

  constructor(
    private sheet: ActionSheetController,
    private platform: Platform,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}

  onPickImage() {
    if (
      (this.platform.is("mobile") && !this.platform.is("hybrid")) ||
      this.platform.is("desktop")
    ) {
      this.sheet
        .create({
          header: "Please choose",
          buttons: [
            {
              text: "Pick from files",
              icon: "images",
              handler: () => {
                this.filePickerRef.nativeElement.click();
              },
            },
            {
              text: "Insert image URL",
              icon: "globe",
              handler: () => {
                this.getImageUrl();
              },
            },
          ],
        })
        .then((sheet) => sheet.present());
    } else {
      this.sheet
        .create({
          header: "Please choose",
          buttons: [
            {
              text: "Take a photo",
              icon: "camera",
              handler: () => {
                this.getPicture(CameraSource.Camera);
              },
            },
            {
              text: "Pick from gallery",
              icon: "images",
              handler: () => {
                this.getPicture(CameraSource.Photos);
              },
            },
            {
              text: "Insert image URL",
              icon: "globe",
              handler: () => {
                this.getImageUrl();
              },
            },
          ],
        })
        .then((sheet) => sheet.present());
    }
  }

  private getPicture(source: CameraSource) {
    Camera.getPhoto({
      quality: 50,
      source: source,
      correctOrientation: true,
      preserveAspectRatio: true,
      height: 320,
      width: 200,
      resultType: CameraResultType.Base64,
    })
      .then((image) => {
        
        const base64Img = "data:image/jpeg;base64," + image.base64String;
        this.selectedImage = base64Img;
        this.imagePicked.emit(base64Img);
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
  }

  onFileChosen(event: Event) {
    const pickedFile = (event.target as HTMLInputElement).files[0];
    if (!pickedFile) {
      return;
    }
    const fr = new FileReader();
    fr.onload = () => {
      const dataUrl = fr.result.toString();
      this.selectedImage = dataUrl;
      this.imagePicked.emit(dataUrl);
    };
    fr.readAsDataURL(pickedFile);
  }

  getImageUrl() {
    this.alertCtrl
      .create({
        header: "Insert image URL",
        inputs: [
          {
            placeholder: "www.example.org/image.jpeg",
            name: "imageUrl",
            type: "text",
          },
        ],
        buttons: [
          { text: "Cancel", role: "destructive" },
          {
            text: "Insert",
            handler: () => {
              this.alertCtrl.dismiss();
            },
          },
        ],
      })
      .then((alert) => {
        alert.present();
        return alert.onDidDismiss();
      })
      .then((alert) => {
        if (alert.role === "destructive") {
          return;
        }
        const imageUrl = alert.data.values.imageUrl;
        this.selectedImage = imageUrl;
        this.urlPicked.emit(imageUrl);
      });
  }
}
