import { Injectable } from '@angular/core';
import { AuthInterceptor } from '../intercepter/http-interceptors/auth-interceptor';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private _authInterceptor: AuthInterceptor
  ) { }

  getAuthorizationToken(): any {
    
  }
}
