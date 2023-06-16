import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  url: string = environment.apiUrl;

  constructor(
    private _httpClient: HttpClient
  ) { }

  add(data: any): Observable<any> {
    const url = this.url + '/category/add';
    return this._httpClient.post(url, data);
  }

  get(): Observable<any> {
    const url = this.url + '/category/get';
    return this._httpClient.get(url);
  }

  update(data: any): Observable<any> {
    const url = this.url + '/category/update';
    return this._httpClient.patch(url, data);
  }
}
