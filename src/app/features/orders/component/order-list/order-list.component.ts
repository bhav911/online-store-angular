import { Component, inject } from '@angular/core';
import { Order } from '../../../../core/models/order';
import { OrderService } from '../../_services/order.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-list',
  imports: [CommonModule],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css'
})
export class OrderListComponent {
private orderService = inject(OrderService);

  orders: Order[] = [];

  ngOnInit(): void {
    this.orderService.getOrders()
      .subscribe(orders => {
        this.orders = orders
      })
  }

  fetchInvoice(orderId: string) {
    this.orderService.fetchOrderInvoice(orderId)
      .subscribe({
        next: blob => {
          const url = window.URL.createObjectURL(blob);
          window.open(url); 
        },
        error: errorMessage => {
          console.log(errorMessage);
        }
      })
  }

}
