import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  @Input() pdf: string;

  constructor(private modalCtr: ModalController) { }

  ngOnInit() {}

  close() {
    this.modalCtr.dismiss();
  }

}
