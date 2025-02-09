import { Routes } from "@angular/router";

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./component/product-list/product-list.component').then(mod => mod.ProductListComponent)
    },
    {
        path: ':productId',
        loadComponent: () => import('./component/product-details/product-details.component').then(mod => mod.ProductDetailsComponent)
    }
]