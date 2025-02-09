import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { catchError, map, throwError } from 'rxjs';
import { Cart } from '../../../core/models/Cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private http = inject(HttpClient);

  constructor() { }

  getCartItems() {
    const graphQLQuery = {
      query: `
        {
          getCartItems{
            product { _id  price  title }
            quantity
          }
        }
      `
    }
    return this.http.post<Cart[]>(environment.backendUrl + '/graphql', graphQLQuery)
      .pipe(
        map(({ data }: any) => {
          return data.getCartItems
        }),
        catchError(err => {
          console.log("Failed to get cart items: " + err);
          return throwError(() => "Something went wrong!")
        })
      )
  }

  addProductToCart(_id: string) {
    const graphQLQuery = {
      query: `
        mutation addToCart($id: String!) {
           addItemToCart(_id: $id)
        }
      `,
      variables: {
        id: _id
      }
    }
    return this.http.post(environment.backendUrl + '/graphql', graphQLQuery)
      .pipe(
        map(({ data }: any) => {
          return data.addItemToCart
        }),
        catchError(err => {
          console.log("Failed to add product to cart: " + err);
          return throwError(() => "Something went wrong!")
        })
      )
  }

  deleteCartItem(_id: string) {
    const graphQLQuery = {
      query: `
        mutation deleteFromCart($id: String!) {
           deleteItemFromCart(_id: $id)
        }
      `,
      variables: {
        id: _id
      }
    }
    return this.http.post(environment.backendUrl + '/graphql', graphQLQuery)
      .pipe(
        map(({ data }: any) => {
          return data.deleteItemFromCart
        }),
        catchError(err => {
          console.log("Failed to delete cart item: " + err);
          return throwError(() => "Something went wrong!")
        })
      )
  }
}
