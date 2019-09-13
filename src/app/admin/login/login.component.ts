import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { TransactionStore } from 'src/app/store/operations/transaction';
import { OperationsService } from 'src/app/operations/services/operations.service';
import { QueueITTransaction } from 'src/app/domainmodel/queueittransaction';
import { AuthService } from '../services/auth.service';
import { UserLoginApiModel } from '../apimodels/userloginapimodel';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { UserAccess } from './../services/userAccess';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/shared/_services';
import { HttpErrorResponse } from '@angular/common/http';
import { Accounts } from 'src/app/valueobjects/accountvo';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private _hubConnection: HubConnection;
  loginForm: FormGroup;
  tellerLoginForm: FormGroup;
  isRequesting: boolean;
  getNewUserProfileForm: FormGroup;
  isNotNull: boolean = false;

  @ViewChild('selectTellerLoginButton') fileInputOpenModal: ElementRef;
  @ViewChild('closeModalButton') fileInputCloseModal: ElementRef;
  @ViewChild('selectNewProfileButton')fileInputNewProfileOpenModal: ElementRef;
  
  constructor(private _router: Router, private _operationsService: OperationsService, 
    public transactionStore: TransactionStore, private _authService: AuthService,
    public userAccess: UserAccess, private spinner: NgxSpinnerService, public alertService: AlertService) { 
      this.loginForm = new FormGroup({
        username: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required)
      });
      this.tellerLoginForm = new FormGroup({
        username: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required)
      });
      this.getNewUserProfileForm = new FormGroup({
        email: new FormControl('', Validators.required)
      });
    }
  
  ngOnInit() {     
    this.userAccess.auth = false;  
    this._authService.logout();
  }

  // goToAdministration(){
  //   this._router.navigate(['admin']);
  //   this.fileInputCloseModal.nativeElement.click();
  // }

  // goToOperations(){
  //   this._router.navigate(['operations']);
  //   this.fileInputCloseModal.nativeElement.click();
  // }

  tellerLogin(){    
    this.fileInputOpenModal.nativeElement.click();
  }

 async loginAsTeller(){
    this.spinner.show();
    let model = new UserLoginApiModel();
    model.Username = this.tellerLoginForm.get('username').value;
    model.Password = this.tellerLoginForm.get('password').value;

    await this._authService.loginAsTeller(model)
      .subscribe((data) => {
        if(data){
          this.spinner.hide();
          this.userAccess.user.isActive = data.isActive;
          if(this.userAccess.user.isActive){
            this.userAccess.user.identity = data.id;
            this.userAccess.user.email = data.email;
            this.userAccess.user.firstname = data.firstname;
            this.userAccess.user.lastname = data.lastname;
            this.userAccess.user.roles = data.roles;
            this._authService.setSession(data);
            /**use the user role to determine
             * what page to navigate to
             */
              let route:string = this.userAccess.accessibleRoute(this.userAccess.user.roles[0]);              
              this.userAccess.auth = true;
              this._router.navigate([route]);      
              this.fileInputCloseModal.nativeElement.click();  
          }
          else{
            this.alertService.error("Oops! Your account has been deactivated. Contact the Operations Department.");
          } 
        }                 
      },
      (err: HttpErrorResponse) => {
        this.spinner.hide();
        this.alertService.error("Oops! Login details are wrong. You need to remember them.");
      }
    );
    
    this._operationsService.getTodaysTransactions()
    .subscribe((data: QueueITTransaction[]) => {
      
    });

  }

  async login(){    
     this.spinner.show();
    let model = new UserLoginApiModel();
    model.Username = this.loginForm.get('username').value;
    model.Password = this.loginForm.get('password').value;

    await this._authService.login(model)
      .subscribe((data) => {
        if(data){
          this.spinner.hide();
          this.userAccess.user.isActive = data.isActive;
          if(this.userAccess.user.isActive){
            this.userAccess.user.identity = data.id;
            this.userAccess.user.email = data.email;
            this.userAccess.user.firstname = data.firstname;
            this.userAccess.user.lastname = data.lastname;
            this.userAccess.user.roles = data.roles;
            this._authService.setSession(data);
            /**use the user role to determine
             * what page to navigate to
             */
              let route:string = this.userAccess.accessibleRoute(this.userAccess.user.roles[0]);
              console.log(route);
              this.userAccess.auth = true;
              this._router.navigate([route]);        
          }
          else{
            this.alertService.error("Oops! Your account has been deactivated. Contact the Operations Department.");
          } 
        }                 
      },
      (err: HttpErrorResponse) => {
        this.spinner.hide();
        this.alertService.error("Oops! Login details are wrong. You need to remember them.");
      }
    );
    
    this._operationsService.getTodaysTransactions()
    .subscribe((data: QueueITTransaction[]) => {
      
    });
    
  }

  getNewUserProfile(){
    this.spinner.show();
    this._authService.getNewUserProfile(this.userAccess.user.email)
        .subscribe((data) => {
          this.spinner.hide();
          this.userAccess.user.identity = data.id;
          this.userAccess.user.email = data.email;
          this.userAccess.user.firstname = data.firstname;
          this.userAccess.user.lastname = data.lastname;
          this.userAccess.user.roles = data.roles;
          this.alertService.success("Yes! You now have a new profile. You can signin now.")
        },
        (err: HttpErrorResponse) => {
          this.alertService.error("Something went wrong. Please contact the IT Department.");
      });
  }

  getUserDetails(){
    this.spinner.show();
    let email = this.getNewUserProfileForm.get("email").value;
    this._authService.getUserOldAccount(email)
        .subscribe((data: Accounts) => {
          this.spinner.hide();
          this.userAccess.user.firstname = data.firstname;
          this.userAccess.user.lastname = data.lastname;
          this.userAccess.user.legacyId = data.identity;
          this.userAccess.user.email = data.username;
          this.userAccess.user.roles = data.roles;
          this.isNotNull = true;
          console.log(this.userAccess.user);
          this.getNewUserProfileForm.setValue({
            email: this.userAccess.user.email
          });
      },
      (err: HttpErrorResponse) => {
        this.alertService.error("We can't find your account. Please contact IT Department.");
      });
  }

}
