import { Injectable } from '@angular/core';
import { Configuration } from 'src/app/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';
import { Role } from 'src/app/domainmodel/role';
import { Status } from 'src/app/domainmodel/status';
import { TransactionType } from 'src/app/domainmodel/transactiontype';
import { DateRangeApiModel } from '../apimodels/daterangeapimodel';
import { QueueITTransaction } from 'src/app/domainmodel/queueittransaction';
import { ChangePasswordApiModel } from '../apimodels/changepasswordapimodel';
import { ManageUserApiModel } from '../apimodels/manageuserapimodel';
import { ManageUserRoleApiModel } from './../apimodels/manageuserroleapimodel';
import { UserVO } from 'src/app/valueobjects/userVO';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  httpOptions: HttpHeaders;

  constructor(private _http: HttpClient, private _configuration: Configuration) { 
    this.httpOptions = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('id_token')
      });
  }

  addRole(rolename: string){
    return this._http.post<string>(this._configuration.ServerAdminWithApiUrl + "addrole", JSON.stringify(rolename), { headers: this.httpOptions})
        .pipe(catchError(this.handleError));
  }

  getRole(id: string){
    return this._http.get<Role>(this._configuration.ServerAdminWithApiUrl + "getrole", 
    {params: {id:id},
    headers: this.httpOptions})
        .pipe(retry(5), catchError(this.handleError));
  }

  getRoles(){
    return this._http.get<Role[]>(this._configuration.ServerAdminWithApiUrl + "getallroles", 
    {headers: this.httpOptions})
        .pipe(catchError(this.handleError));
  }

  getAllTellers(){
    return this._http.get<UserVO[]>(this._configuration.ServerAdminWithApiUrl + "getalltellers", 
    {headers: this.httpOptions})
        .pipe(catchError(this.handleError));
  }

  updateRole(role: Role){
    return this._http.post<Role>(this._configuration.ServerAdminWithApiUrl + 
      "updateRole", JSON.stringify(role), { headers: this.httpOptions})
        .pipe(retry(100), catchError(this.handleError));
  }

  addStatus(statusname: string){
    return this._http.post<string>(this._configuration.ServerAdminWithApiUrl + "addstatus", JSON.stringify(statusname), { headers: this.httpOptions})
        .pipe(catchError(this.handleError));
  }

  getStatus(id: string){
    return this._http.get<Status>(this._configuration.ServerAdminWithApiUrl + "getstatus", 
    {params: { id: id},
     headers: this.httpOptions})
        .pipe(retry(5), catchError(this.handleError));
  }

  getStatusList(){
    return this._http.get<Status>
    (this._configuration.ServerAdminWithApiUrl + "getallstatus", {headers: this.httpOptions})
        .pipe(catchError(this.handleError));
  }

  getUsers(){
    return this._http.get(this._configuration.ServerAdminWithApiAccountUrl + "getallusers", {headers: this.httpOptions})
        .pipe(catchError(this.handleError));
  }

  updateStatus(status: Status){
    return this._http.post(this._configuration.ServerAdminWithApiUrl + "updatestatus", JSON.stringify(status), { headers: this.httpOptions})
        .pipe(catchError(this.handleError));
  }

  addTransactionType(transactiontypename: string){
    return this._http.post<string>(this._configuration.ServerAdminWithApiUrl + "addtransactiontype", JSON.stringify(transactiontypename), { headers: this.httpOptions})
        .pipe(catchError(this.handleError));
  }

  updateUser(model: ManageUserApiModel){
    return this._http.post(this._configuration.ServerAdminWithApiAccountUrl + "updateuser", JSON.stringify(model), { headers: this.httpOptions})
        .pipe(catchError(this.handleError));
  }

  deactivateUser(id: string){
    return this._http.post(this._configuration.ServerAdminWithApiAccountUrl + "deactivateuser", JSON.stringify(id), { headers: this.httpOptions})
        .pipe(retry(2),catchError(this.handleError));
  }

  reactivateUser(id: string){
    return this._http.post(this._configuration.ServerAdminWithApiAccountUrl + "reactivateuser", JSON.stringify(id), { headers: this.httpOptions})
        .pipe(retry(2),catchError(this.handleError));
  }

  addRoleToUser(model: ManageUserRoleApiModel){
    return this._http.post<string>(this._configuration.ServerAdminWithApiAccountUrl + "addusertorole", JSON.stringify(model), { headers: this.httpOptions})
        .pipe(catchError(this.handleError));
  }

  removeRoleFromUser(model: ManageUserRoleApiModel){
    return this._http.post<string>(this._configuration.ServerAdminWithApiAccountUrl + "removerole", JSON.stringify(model), { headers: this.httpOptions})
        .pipe(catchError(this.handleError));
  }

  changeNewPassword(model: ChangePasswordApiModel){
    return this._http.post(this._configuration.ServerAdminWithApiAccountUrl + "changeuserpassword", JSON.stringify(model), { headers: this.httpOptions})
        .pipe(catchError(this.handleError));
  }

  register(model: ManageUserApiModel){
    return this._http.post(this._configuration.ServerAdminWithApiAccountUrl + "register", JSON.stringify(model), { headers: this.httpOptions})
        .pipe(catchError(this.handleError));
  }

  getTransactiontype(id: string){
    return this._http.post<TransactionType>(this._configuration.ServerAdminWithApiUrl + "gettransactiontype", 
    {params: {id: id},
     headers: this.httpOptions})
        .pipe(retry(5), catchError(this.handleError));
  }

  getTransactiontypes(){
    return this._http.get<TransactionType[]>(this._configuration.ServerAdminWithApiUrl + "getalltransactiontypes", {headers: this.httpOptions})
        .pipe(catchError(this.handleError));
  }

  updateTransactiontype(transactiontype: TransactionType){
    return this._http.post<TransactionType>(this._configuration.ServerAdminWithApiUrl + "updatetransactiontype", JSON.stringify(transactiontype), { headers: this.httpOptions})
        .pipe(retry(2), catchError(this.handleError));
  }

  getTransactionsInDateRange(range: DateRangeApiModel){
    return this._http.post(this._configuration.ServerAdminWithApiUrl + "gettransactionsdateinrange", JSON.stringify(range), { headers: this.httpOptions})
        .pipe(catchError(this.handleError));
  }
  
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }  
}
