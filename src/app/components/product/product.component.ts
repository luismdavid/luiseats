import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Product } from 'src/app/models/product.interface';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {

  @Input() product: Product;
  @Output() onCartAdd: EventEmitter<Product> = new EventEmitter();

  constructor() { }

  ngOnInit() {}

}
