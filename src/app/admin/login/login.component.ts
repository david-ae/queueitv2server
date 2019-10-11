import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { TransactionStore } from 'src/app/store/operations/transaction';
import { OperationsService } from 'src/app/operations/services/operations.service';
import { QueueITTransaction } from 'src/app/domainmodel/queueittransaction';
import { AuthService } from '../services/auth.service';
import { UserLoginApiModel } from '../apimodels/userloginapimodel';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { UserAccess } from './../../services/authentication/usersAccess';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/shared/_services';
import { HttpErrorResponse } from '@angular/common/http';
import { Accounts } from 'src/app/valueobjects/accountvo';
import { AuthResult } from '../apimodels/authresult';
import { UserVO } from 'src/app/valueobjects/userVO';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private _hubConnection: HubConnection;
  loginForm: FormGroup;
  // tellerLoginForm: FormGroup;
  roleSelectionForm: FormGroup;
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
      // this.tellerLoginForm = new FormGroup({
      //   username: new FormControl('', Validators.required),
      //   password: new FormControl('', Validators.required)
      // });
      this.roleSelectionForm = new FormGroup({

      });
      this.getNewUserProfileForm = new FormGroup({
        email: new FormControl('', Validators.required)
      });
    }
  
  ngOnInit() {     
    this._authService.logout();
  }

  goToAdministration(){
    this._router.navigate(['admin']);
    this.userAccess.auth = true;
    this.fileInputCloseModal.nativeElement.click();
  }

  goToOperations(){
    this._router.navigate(['operations']);
    this.userAccess.auth = true;
    this.fileInputCloseModal.nativeElement.click();
  }

  async login(){    
     this.spinner.show();
    let model = new UserLoginApiModel();
    model.Username = this.loginForm.get('username').value;
    model.Password = this.loginForm.get('password').value;

    await this._authService.login(model)
      .subscribe((data:AuthResult) => {
        if(data.authenticated){  
            this.setUserData(data);
            this.spinner.hide();
        }
        else{
          this.spinner.hide();
          this.alertService.error("Oops! Login details are wrong. You need to remember them.");
        }                                
      },
      (err: HttpErrorResponse) => {
        this.spinner.hide();
        this.alertService.error("Oops! Something went wrong. Please try again.");
      }
    );   
    
    this._operationsService.getTodaysTransactions()
    .subscribe((data: QueueITTransaction[]) => {
      
    });
    
  }

  async setUserData(response: AuthResult){
    await this._authService.getUserUsingId(response.id)
      .subscribe((userdetails: UserVO) => {
        if(userdetails.isActive){                    
          this.spinner.hide(); 
          console.log(userdetails);
          this.userAccess.user.identity = userdetails.identity;
          this.userAccess.user.email = userdetails.email;
          this.userAccess.user.firstname = userdetails.firstname;
          this.userAccess.user.lastname = userdetails.lastname;
          this.userAccess.user.roles = userdetails.roles;
          this._authService.setSession(response);
          /**use the user role to determine
           * what page to navigate to
           */
          let noOfRolesCheckResult = this.userAccess.isHasMoreThanOneRole(this.userAccess.user.roles);
          if(noOfRolesCheckResult){
            this.fileInputOpenModal.nativeElement.click();
          }
          else{
            this.userAccess.auth = true;
            let route:string = this.userAccess.accessibleRoute(this.userAccess.user.roles[0]);
            this._router.navigate([route]);
          }          
        }
        else{
          this.alertService.error("Oops! Your account has been deactivated. Contact the Operations Department.");
        } 
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
