import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from '../services/token.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private tokenServices: TokenService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    request = this.addToken(request)
    return next.handle(request);
  }

  private addToken(request: HttpRequest<unknown>){
    const token = this.tokenServices.getToken();
    if (token) {
      const authReq = request.clone({
        headers: request.headers.set('authorization', `Bearer ${token}`)
      });
      return authReq;
    }
    return request
  }
}
