import { Injectable } from '@angular/core';

@Injectable()
export class Configuration{
    public ApiServer: string = "http://localhost:5000/";
    public ApiServerSSL: string = "https://localhost:5001/";
    //public ApiServerSSL: string = "http://queueit.autoreglive.com/";
    //public ApiServerSSL: string = "http://localhost:56242/";
    //public ApiServerSSL: string = "https://localhost:44328/";
    public ApiAdminUrlAccount: string = "api/administration/account/";
    public ServerAdminWithApiAccountUrl: string = this.ApiServerSSL + this.ApiAdminUrlAccount;

    public ApiAdminUrl: string = "api/administration/home/";
    public ServerAdminWithApiUrl: string = this.ApiServerSSL + this.ApiAdminUrl;

    public ApiOperationsUrl: string = "api/operations/home/";
    public ServerOperationsWithApiUrl: string = this.ApiServerSSL + this.ApiOperationsUrl;
}