import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { throwError } from 'rxjs'; 
import { catchError, finalize, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptorInterceptor implements HttpInterceptor {

  constructor(
    public _router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log('=========================================== 3');

    const token = localStorage.getItem('token');

    console.log('=========================================== 4',token);

    if(token) {
      request = request.clone({
        setHeaders: {Authorization: `Bearer ${token}`}
      })
    }

    console.log('=========================================== 5', token);


    return next.handle(request).pipe(
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
