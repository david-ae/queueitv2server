import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Configuration } from 'src/app/config';
import { catchError, retry, finalize } from 'rxjs/operators';
import { QueueITTransaction } from 'src/app/domainmodel/queueittransaction';
import { TransactionApiModel } from '../apimodels/transactionapimodel';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  httpOptions = {};

  constructor(private _http: HttpClient, private _configuration: Configuration) { 
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authoratization': ''
      })
    };
  }

  addTransaction(transaction: TransactionApiModel){
    return this._http.post<TransactionApiModel>(this._configuration.ServerOperationsWithApiUrl + "addtransaction", JSON.stringify(transaction), this.httpOptions)
        .pipe(retry(2), catchError(this.handleError));
  }

  updateTransaction(transaction: QueueITTransaction){    
    return this._http.post<QueueITTransaction>(this._configuration.ServerOperationsWithApiUrl + "updatetransaction", JSON.stringify(transaction), this.httpOptions)
        .pipe(catchError(this.handleError));
  }

  getTransactions(){
    return this._http.get<QueueITTransaction>(this._configuration.ServerOperationsWithApiUrl + "getalltransactions", this.httpOptions)
        .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

  testSignalr(){
    return this._http.post(this._configuration.ApiServer + "api/message", this.httpOptions)
          .pipe(catchError(this.handleError))
  }
  
}
