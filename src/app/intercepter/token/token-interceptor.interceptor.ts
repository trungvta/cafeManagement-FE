import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { throwError } from 'rxjs'; 
import { catchError, finalize, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable()
export class TokenInterceptorInterceptor implements HttpInterceptor {

  url: string = environment.apiUrl;
  urlLogin: string = '';

  constructor(
    public _router: Router
  ) {
    this.urlLogin = this.url + '/user/login';
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log('=========================================== request', request);


    const token = localStorage.getItem('token');

    console.log('=========================================== 4',token);

    if(token) {
      request = request.clone({
        setHeaders: {Authorization: `Bearer ${token}`}
      })
    }

    console.log('=========================================== 5', token);

    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse && request.url === this.urlLogin) {
          const responseToken = event.body?.token;

          if (responseToken) {
            console.log('=========================================== 6', responseToken);
            
            localStorage.setItem('token', event.body?.token);
          }
        }
      }),
      catchError((error: any) => {
        if(error instanceof HttpErrorResponse) {
          console.log(error.url);

          if(error.status == 401 || error.status == 403) {
            if(this._router.url === '/') {}
            else {
              localStorage.clear();
              this._router.navigate(['/'])
            }
          }
        }
        return throwError(error)
      })
    );
  }
}
