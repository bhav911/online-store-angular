import { Routes } from "@angular/router";

export const routes: Routes = [
    {
        path: 'add-product',
        loadComponent: () => import('./add-product/add-product.component').then(mod => mod.AddProductComponent)
    },
    {
        path: 'edit-product/:productId',
        loadComponent: () => import('./add-product/add-product.component').then(mod => mod.AddProductComponent)
    },
]