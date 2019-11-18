import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Configuration } from 'src/app/config';
import { catchError, delay } from 'rxjs/operators';
import { TransactionType } from 'src/app/domainmodel/transactiontype';
import { UserVO } from 'src/app/valueobjects/userVO';
import { Accounts } from 'src/app/valueobjects/accountvo';
import { QueueITTransaction } from 'src/app/domainmodel/queueittransaction';
import { TransactionStore } from 'src/app/store/operations/transaction';

@Injectable({
  providedIn: 'root'
})
export class OperationsService {
  
  httpOptions = {};

  constructor(private _http: HttpClient, private _configuration: Configuration,
    public transactionStore: TransactionStore) { 
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('id_token')}`
      })
    };
  }  

  getTransactiontypes(){
    return this._http.get<TransactionType[]>(this._configuration.ServerAdminWithApiUrl + "getalltransactiontypes",
    { headers: this.httpOptions } )
        .pipe(catchError(this.handleError));
  }
  
  getTodaysTransactions(){
    return this._http.get<QueueITTransaction[]>(this._configuration.ServerOperationsWithApiUrl + "getTodaysTransactions",
    { 
      headers: this.httpOptions
    } )
        .pipe(delay(100),catchError(this.handleError));
    }

  getAssignedTransactionsForTeller(id: string){
    return this._http.get<QueueITTransaction[]>(this._configuration.ServerOperationsWithApiUrl + "getAssignedTellersTransactions",
    { params: { id: id },
      headers: this.httpOptions
     } )
        .pipe(delay(100), catchError(this.handleError));
  }

  getSeniorTellers(){
    return this._http.get<UserVO[]>(this._configuration.ServerOperationsWithApiUrl + "getallseniortellers", 
    { headers: this.httpOptions})
        .pipe(catchError(this.handleError));
  }

  getTransactionalTellers(){
    return this._http.get<UserVO[]>(this._configuration.ServerOperationsWithApiUrl + "getalltransactionaltellers", 
    {headers: this.httpOptions})
        .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
