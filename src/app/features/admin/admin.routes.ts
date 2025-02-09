import { Routes } from "@angular/router";

export const routes: Routes = [
    {
        path: 'products',
        loadComponent: () => import('../product/component/product-list/product-list.component').then(mod => mod.ProductListComponent)
    },
    {
        path: 'product',
        loadChildren: () => import('../product/admin/product.routes').then(mod => mod.routes)
    }
]