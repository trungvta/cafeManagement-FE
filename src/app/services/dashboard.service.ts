import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  _url = environment.apiUrl;

  constructor(
    private _httpClient: HttpClient
  ) { }

  getDetails() {
    const url = this._url + "/dashboard/details";
    return this._httpClient.get(url)
  }
}
