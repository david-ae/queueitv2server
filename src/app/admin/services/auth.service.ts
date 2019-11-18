import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { Configuration } from 'src/app/config';
import { TransactionStore } from 'src/app/store/operations/transaction';
import { UserVO } from 'src/app/valueobjects/userVO';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { delay, catchError } from 'rxjs/operators';
import * as moment from 'moment';
import { UserLoginApiModel } from './../apimodels/userloginapimodel';
import { UserAccess } from './userAccess';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = false;
  httpOptions: HttpHeaders;

  constructor(private userAccess: UserAccess, private _configuration: Configuration, private _http: HttpClient) { 
    this.httpOptions = new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token')
    });
  }

  login(model: UserLoginApiModel){
    return this._http.post<UserLoginApiModel>(this._configuration.ServerAdminWithApiAccountUrl + "login", JSON.stringify(model), { headers: this.httpOptions})
        .pipe(delay(100), catchError(this.handleError));
  }

  getUserUsingId(id: string){
    return this._http.get(this._configuration.ServerAdminWithApiAccountUrl + "getUserUsingId",
    {params: { id: id}, 
     headers: this.httpOptions})
        .pipe(delay(100), catchError(this.handleError));
  }

  loginAsTeller(model: UserLoginApiModel){
    return this._http.post<UserLoginApiModel>(this._configuration.ServerAdminWithApiAccountUrl + "loginasteller", JSON.stringify(model), { headers: this.httpOptions})
        .pipe(delay(100), catchError(this.handleError));
  }

  getNewUserProfile(email: string){
    return this._http.post(this._configuration.ServerAdminWithApiAccountUrl + "getNewAccountProfile", JSON.stringify(email), { headers: this.httpOptions})
        .pipe(delay(100), catchError(this.handleError));
  }

  getUserOldAccount(email: string){
    return this._http.post(this._configuration.ServerAdminWithApiAccountUrl + "getUserUsingAccountByEmail", JSON.stringify(email), { headers: this.httpOptions})
        .pipe(delay(100), catchError(this.handleError));
  }

  setSession(authResult) {
      const expiresAt = moment().add(authResult.expires_in,'second');
      localStorage.removeItem('id_token');
      localStorage.setItem('id_token', authResult.auth_token);
      localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
  }

  getExpiration() {
      const expiration = localStorage.getItem("expires_at");
      const expiresAt = JSON.parse(expiration);
      return moment(expiresAt);
  }

  isLoggedIn():boolean{
      return moment().isBefore(this.getExpiration());
  }

  isLoggedOut(){
      return !this.isLoggedIn();
  }     

  logout(){
      localStorage.removeItem('id_token');
      localStorage.removeItem("expires_at");
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
