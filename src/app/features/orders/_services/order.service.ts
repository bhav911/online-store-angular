import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { catchError, map, throwError } from 'rxjs';
import { Order } from '../../../core/models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private http = inject(HttpClient)

  constructor() { }

  getOrders() {
    const graphQLQuery = {
      query: `
        {
          getOrders {
            _id
            products{
              quantity
              product{
                _id
                title
                price
              }
            }
          }
        }
      `
    }
    return this.http.post<Order[]>(environment.backendUrl + '/graphql', graphQLQuery)
      .pipe(
        map(({ data }: any) => {
          return data.getOrders
        }),
        catchError(err => {
          console.log('failed to place order: ' + err);
          return throwError(() => 'Something went wrong!')
        })
      )
  }

  getOrder(orderId: string) {
    const graphQLQuery = {
      query: `
        query getOrderDetails($orderId: String!){
          getOrderDetails(orderId: $orderId){
            products{
              quantity
              product{
                _id
                title
                price
              }
            }
          }
        }
      `,
      variables: {
        orderId: orderId
      }
    }
    return this.http.post<Order>(environment.backendUrl + `/graphql`, graphQLQuery)
      .pipe(
        map(({ data }: any) => {
          return data.getOrderDetails
        }),
        catchError((err: HttpErrorResponse) => {
          console.log('failed to fetch order invoice: ' + err);
          return throwError(() => err.error.message || 'Something went wrong!')
        })
      )
  }

  placeOrder(session_id: string) {
    const graphQLQuery = {
      query: `
        mutation placeOrder($session_id: String!){
          placeOrder(session_id: $session_id)
        }
      `,
      variables: {
        session_id: session_id
      }
    }
    return this.http.post(environment.backendUrl + '/graphql', graphQLQuery)
      .pipe(
        map(({ data }: any) => {
          return data.placeOrder
        }),
        catchError(err => {
          console.log('failed to place order: ' + err);
          return throwError(() => 'Something went wrong!')
        })
      )
  }

  fetchOrderInvoice(orderId: string) {
    return this.http.get(environment.backendUrl + `/orders/invoice/${orderId}`, {
      responseType: 'blob'
    })
      .pipe(
        catchError((err: HttpErrorResponse) => {
          console.log('failed to fetch order invoice: ' + err);
          return throwError(() => err.error.message || 'Something went wrong!')
        })
      )
  }
}
