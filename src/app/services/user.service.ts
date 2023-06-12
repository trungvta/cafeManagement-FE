import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs'; 

import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  _url: string = environment.apiUrl;
  constructor(
    private httpClient: HttpClient
  ) { }

  signup(data: any): Observable<any> {
    const url = this._url + "/user/signup";
    const options = {
      headers: new HttpHeaders().set('ContentType',"application/json")
    }

    return this.httpClient.post(url, data, options).pipe(
      catchError((error: any) => {
        return throwError('Đã xảy ra lỗi trong quá trình đăng ký!');
      })
    );
  }
}
