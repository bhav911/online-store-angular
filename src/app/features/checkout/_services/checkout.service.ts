import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { catchError, map, throwError } from 'rxjs';
import { Cart } from '../../../core/models/Cart';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private http = inject(HttpClient);

  constructor() { }

  getCheckout() {
    const graphQLQuery = {
      query: `
        {
          getCheckout {
            session_id
            products {
              quantity
              product {
                title
                price
              }
            }
          }
        }
      `
    }
    return this.http.post(environment.backendUrl + '/graphql', graphQLQuery)
      .pipe(
        map(({ data }: any) => {
          return data.getCheckout
        }),
        catchError(err => {
          console.log("Failed to get cart items: " + err);
          return throwError(() => "Something went wrong!")
        })
      )
  }
}
