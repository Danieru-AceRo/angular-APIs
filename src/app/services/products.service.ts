import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpStatusCode } from '@angular/common/http';
import { catchError, map, retry } from 'rxjs/operators';

import { CreateProduct, Product, UpdateProduct } from './../models/product.model';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiurl = 'https://young-sands-07814.herokuapp.com/api/products'

  constructor(
    private http: HttpClient
  ) { }

  getAllProducts(limit?: number, offset?: number) {
    let params = new HttpParams();
    if (limit && offset) {
      params = params.set('limit', limit);
      params = params.set('params', limit);
    }
    console.log('parametro', params);
    
    return this.http.get<Product[]>(this.apiurl, {params})
    .pipe(
      retry(3),
      map(products => products.map(item => {
        return {
          ...item,
          taxes: .19 * item.price
        }
      }))
    );
  }

  getProduct(id: string){
    return this.http.get<Product>(`${this.apiurl}/${id}`)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === HttpStatusCode.Conflict) {
          return throwError('algo salio mal en el servidor')
        }
        if (error.status === HttpStatusCode.NotFound) {
          return throwError('El producto ya no está disponible')
        }
        if (error.status === HttpStatusCode.Unauthorized) {
          return throwError('usted no está autorizado para acceder a esta seccion')
        }
        return throwError('Ups algo salió mal')
      })
    )
  }

  getAllProductsByPage(limit: number, offset: number) {
    return this.http.get<Product[]>(this.apiurl, {
      params: {limit, offset}
    });
  }

  create(data: CreateProduct){
    return this.http.post<Product>(this.apiurl, data);
  }

  update(id:string, data: UpdateProduct){
    return this.http.put<Product>(`${this.apiurl}/${id}`, data);
  }

  delete(id: string) {
    return this.http.delete<boolean>(`${this.apiurl}/${id}`);
  }
}
