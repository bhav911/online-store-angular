import { Component, input, OnInit } from '@angular/core';
import { Order } from '../../../../core/models/order';

@Component({
  selector: 'app-order',
  imports: [],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent {

  order = input.required<Order>();

  get totalAmount() {
    console.log(this.order());

    return this.order().products.reduce((prev, val) => {
      return prev + (val.product.price * val.quantity)
    }, 0)
  }
}
