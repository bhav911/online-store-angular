import { Routes } from '@angular/router';
import { orderResolver } from './component/order/order.resolver';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./component/order-list/order-list.component').then(mod => mod.OrderListComponent),
    },
    {
        path: 'confirmation',
        loadComponent: () => import('./component/confirmation/confirmation.component').then(mod => mod.ConfirmationComponent),
    },
    {
        path: ':orderId',
        loadComponent: () => import('./component/order/order.component').then(mod => mod.OrderComponent),
        resolve:{
            order: orderResolver
        }
    }
]