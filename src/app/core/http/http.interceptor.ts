import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CsrfService } from '../services/csrf.service';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  // const csrfService = inject(CsrfService);

  let headers = req.headers;

  const jwtToken = localStorage.getItem('token');

  headers = headers.set('Authorization', 'Bearer ' + jwtToken);

  const modifiedReq = req.clone({
    headers,
    withCredentials: true,
  });

  return next(modifiedReq);
};
