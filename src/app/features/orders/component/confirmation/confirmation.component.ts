import { Component, inject, input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../_services/order.service';

@Component({
  selector: 'app-confirmation',
  imports: [],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.css'
})
export class ConfirmationComponent implements OnInit {

  private activatedRoute = inject(ActivatedRoute)
  private router = inject(Router)

  private orderService = inject(OrderService)

  session_id = "";

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(param => {
      this.session_id = param['session_id'];

      if (this.session_id) {
        this.orderService.placeOrder(this.session_id).subscribe({
          next: orderId => {
            console.log(orderId);
            return this.router.navigate(['orders', orderId], {
              replaceUrl: true
            })
          },
          error: error => {
            console.log(error);
          }
        })
      }
    })
  }

}
