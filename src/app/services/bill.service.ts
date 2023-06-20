import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BillService {

  url: string = environment.apiUrl + '/bill';

  constructor(
    private _httpClient: HttpClient
  ) { }

  generateReport(data: any): Observable<any> {
    const url = this.url + '/generateReport';
    return this._httpClient.post(url, data);
  }

  getPDF(data: any): Observable<any> {
    const url = this.url + '/getPDF';
    return this._httpClient.post(url, data);
  }

  getBills(): Observable<any> {
    const url = this.url + '/getBills';
    return this._httpClient.get(url);
  }

  delete(id: number): Observable<any> {
    const url = this.url + '/delete' + id;
    return this._httpClient.delete(url);
  }
  
}
