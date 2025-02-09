import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./components/checkout/checkout.component').then(mod => mod.CheckoutComponent),
    },
    {
        path: 'cancel',
        loadComponent: () => import('./components/checkout/checkout.component').then(mod => mod.CheckoutComponent),
    }
]