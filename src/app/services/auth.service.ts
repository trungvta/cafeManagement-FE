import { Injectable } from '@angular/core';
// import { AuthInterceptor } from '../intercepter/http-interceptors/auth-interceptor';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    // private _authInterceptor: AuthInterceptor,
    private _router: Router
  ) { }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if(!token) {
      this._router.navigate(['/']);
      return false;
    }
    else return true;
  }
}
