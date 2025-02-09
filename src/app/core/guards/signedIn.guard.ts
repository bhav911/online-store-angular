import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';

export const signedInGuard: CanActivateFn = (route, state) => {
    const router = inject(Router)

    const authService = inject(AuthService);

    return authService.userValue
        .pipe(map(user => {
            if (!user) {
                return true;
            }
            return router.createUrlTree([])
        }))
};
