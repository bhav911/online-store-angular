import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/component/login/login.component';
import { ResetPasswordComponent } from './features/auth/component/reset-password/reset-password.component';
import { SignupComponent } from './features/auth/component/signup/signup.component';
import { signedInGuard } from './core/guards/signedIn.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [signedInGuard]
    },
    {
        path: 'reset-password',
        component: ResetPasswordComponent
    },
    {
        path: 'reset-password/:token',
        component: ResetPasswordComponent
    },
    {
        path: 'signup',
        component: SignupComponent,
        canActivate: [signedInGuard]
    },
    {
        path: 'home',
        loadComponent: () => import('./features/home/home.component').then(mod => mod.HomeComponent)
    },
    {
        path: 'products',
        loadChildren: () => import('./features/product/product.routes').then(mod => mod.routes)
    },
    {
        path: 'cart',
        loadComponent: () => import('./features/cart/component/cart/cart.component').then(mod => mod.CartComponent),
        canActivate: [authGuard]
    },
    {
        path: 'checkout',
        loadChildren: () => import('./features/checkout/checkout.routes').then(mod => mod.routes),
        canActivate: [authGuard]
    },
    {
        path: 'orders',
        loadChildren: () => import('./features/orders/order.routes').then(mod => mod.routes),
        canActivate: [authGuard]
    },
    {
        path: 'admin',
        loadChildren: () => import('./features/admin/admin.routes').then(mod => mod.routes),
        canActivate: [authGuard]
    },
    {
        path: '**',
        loadComponent: () => import('./core/components/page-not-found/page-not-found.component').then(mod => mod.PageNotFoundComponent),
    }
];
