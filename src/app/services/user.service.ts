import { Injectable } from '@angular/core';

import { finalize, tap } from 'rxjs/operators';

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
    return this.httpClient.post(url, data);
  }

  forgotPassword(data: any): Observable<any> {
    const url = this._url + "/user/forgotPassword";

    console.log(url);
    console.log(data);

    return this.httpClient.post(url, data)
  }

}
