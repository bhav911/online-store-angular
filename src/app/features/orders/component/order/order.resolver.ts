import { ResolveFn } from '@angular/router';
import { Order } from '../../../../core/models/order';
import { inject } from '@angular/core';
import { OrderService } from '../../_services/order.service';
import { of } from 'rxjs';

export const orderResolver: ResolveFn<Order | null> = (route, state) => {
  const orderService = inject(OrderService);

  const orderId = route.paramMap.get('orderId');
  if (!orderId) {
    return of(null);
  }  

  return orderService.getOrder(orderId);
};
