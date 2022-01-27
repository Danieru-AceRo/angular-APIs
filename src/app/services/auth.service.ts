import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Auth } from '../models/auth.model';
import { User } from '../models/user.model';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://young-sands-07814.herokuapp.com/api/auth'

  constructor(
    private http: HttpClient,
    private TokenService: TokenService
  ) { }

  login(email: string, password: string) {
    return this.http.post<Auth>(`${this.apiUrl}/login`, {email, password} )
    .pipe(
      tap(response => this.TokenService.saveToken(response.access_token))
    )
  }

  profile(token: string) {
    return this.http.get<User>(`${this.apiUrl}/profile`, {
      // headers: {
      //   authorization: `Bearer ${token}`,
      //   // 'Content-type': 'application/json'
      // }
    })
  }
}
