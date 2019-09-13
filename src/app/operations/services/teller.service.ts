import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Configuration } from 'src/app/config';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TellerService {
  
  httpOptions = {};

  constructor(private _httpclient: HttpClient, private _configuration: Configuration) { 
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': ''
      })
    };
  }

  getTellerById(tellerId: any){
    return this._httpclient.post(this._configuration.ServerAdminWithApiAccountUrl + "getTellerUsingAccountById", JSON.stringify(tellerId), this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getTellerByEmail(email: string){
    return this._httpclient.post(this._configuration.ServerAdminWithApiAccountUrl + "getTellerUsingAccountByEmail", JSON.stringify(email), this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}