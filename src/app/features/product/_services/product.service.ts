import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Product } from '../../../core/models/Product';
import { catchError, map, Observable, of, switchMap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private http = inject(HttpClient);

  constructor() { }

  addProduct(product: FormData) {
    return this.http.post(environment.backendUrl + '/store-image', product)
      .pipe(
        switchMap((imagePath: any) => {
          const graphQLQuery = {
            query: `
              mutation createProduct($title: String!, $description: String!, $price: Int!, $imageUrl: String) {
                createProduct(
                productInput: {
                  title: $title, 
                  description: $description, 
                  price: $price, 
                  imageUrl: $imageUrl
                })
                {
                  _id
                  title
                }
              }
            `,
            variables: {
              title: product.get('title'),
              description: product.get('description'),
              price: +product.get('price')!,
              imageUrl: imagePath.path,
            }
          }
          return this.http.post(environment.backendUrl + '/graphql', graphQLQuery)
        }),
        catchError((error: HttpErrorResponse) => {
          let message = "";
          if (error.error.errors[0].data) {
            message = error.error.errors[0].data[0].message
          }
          else {
            message = error.error.errors[0].message
          }
          console.log('Failed to create Product: ' + message);
          return throwError(() => {
            return { message };
          });
        })
      )

  }

  updateProduct(_id: string, product: FormData) {
    let imageUpload$: Observable<any> = of(null);
    if (product.get("image")) {
      imageUpload$ = this.http.post(environment.backendUrl + "/store-image", product);
    }

    return imageUpload$.pipe(
      switchMap((imagePath) => {
        const imageUrl = imagePath?.path ? imagePath.path : '';
        const graphQLQuery = {
          query: `
            mutation updateProduct($id: String, $title: String!, $description: String!, $price: Int!, $imageUrl: String) {
              updateProduct(
              productInput: {
                  _id: $id
                  title: $title, 
                  description: $description, 
                  price: $price, 
                  imageUrl: $imageUrl
                })
              {
                _id
                title
              }
            }
          `,
          variables: {
            id: _id,
            title: product.get('title'),
            description: product.get('description'),
            price: +product.get('price')!,
            imageUrl: imageUrl,
          }
        }
        return this.http.post(environment.backendUrl + "/graphql", graphQLQuery);
      }),
      catchError((err) => {
        console.error("Failed to update product:", err);
        return throwError(() => new Error("Something went wrong!"));
      })
    )
  }

  deleteProduct(_id: string) {
    const graphQLQuery = {
      query: `
        mutation deleteProduct($id: String!){
          deleteProduct(_id: $id)
        }
      `,
      variables: {
        id: _id
      }
    }
    return this.http.post(environment.backendUrl + '/graphql', graphQLQuery)
      .pipe(
        catchError(err => {
          console.log("Failed to delete product: " + err);
          return throwError(() => "Something went wrong!")
        })
      )
  }

  getProduct(_id: string) {
    const graphQLQuery = {
      query: `
        query getProduct($id: String!) {
          product(_id: $id)
          {
            _id title description price imageUrl }
        }
      `,
      variables: {
        id: _id
      }
    }
    return this.http.post<Product>(environment.backendUrl + `/graphql`, graphQLQuery)
      .pipe(
        map(({ data }: any) => {
          return data.product;
        }),
        catchError((err) => {
          console.log("Failed to fetch product: " + err.error.errors[0].message);

          return throwError(() => "Something went wrong!")
        })
      )
  }

  getProducts(role: string = "user", page: number) {
    let graphQLQuery = {
      query: `
        query getProducts($role: String!, $page: Int!) {
          products(role: $role, page: $page)
          {
            products{
                _id title price imageUrl description
            }
            productCount
          }
        }
      `,
      variables: {
        role: role,
        page: page
      }
    }

    return this.http.post<any>(environment.backendUrl + '/graphql', graphQLQuery)
      .pipe(
        map(({ data }) => {
          return data.products
        }),
        catchError(err => {
          console.log("Failed to fetch products: " + err);
          return throwError(() => "Something went wrong!")
        })
      )
  }
}
