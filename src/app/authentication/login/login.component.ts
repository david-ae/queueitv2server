import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { TransactionStore } from 'src/app/store/operations/transaction';
import { OperationsService } from 'src/app/operations/services/operations.service';
import { QueueITTransaction } from 'src/app/domainmodel/queueittransaction';
import { AuthService } from '../services/auth.service';
import { UserLoginApiModel } from '../apimodels/userloginapimodel';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { UserAccess } from 'src/app/services/authentication/usersAccess';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/shared/_services';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private _hubConnection: HubConnection;
  loginForm: FormGroup;
  roleSelectionForm: FormGroup;
  isRequesting: boolean;
  @ViewChild('selectRoleButton') fileInputOpenModal: ElementRef;
  @ViewChild('closeModalButton') fileInputCloseModal: ElementRef;
  
  constructor(private _router: Router, private _operationsService: OperationsService, 
    public transactionStore: TransactionStore, private _authService: AuthService,
    public userAccess: UserAccess, private spinner: NgxSpinnerService, public alertService: AlertService) { 
      this.loginForm = new FormGroup({
        username: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required)
      });
      this.roleSelectionForm = new FormGroup({

      });
    }
  
  ngOnInit() {       
    this._authService.logout();
  }

  goToAdministration(){
    this._router.navigate(['admin']);
    this.fileInputCloseModal.nativeElement.click();
  }

  goToOperations(){
    this._router.navigate(['operations']);
    this.fileInputCloseModal.nativeElement.click();
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
            let noOfRolesCheckResult = this.userAccess.isHasMoreThanOneRole(this.userAccess.user.roles);
            if(noOfRolesCheckResult){
              this.fileInputOpenModal.nativeElement.click();
            }
            else{
              let route:string = this.userAccess.accessibleRoute(this.userAccess.user.roles[0]);
              console.log(route);
              this._router.navigate([route]);
            }          
          }
          else{
            this.alertService.error("Oops! Your account has been deactivated. Contact the Operations Department.");
          } 
        }                 
      },
      (err: HttpErrorResponse) => {
        this.spinner.hide();
        console.log("Error: " + err);
        this.alertService.error("Oops! Login details are wrong. You need to remember them.");
      }
    );
    
    this._operationsService.getTodaysTransactions()
    .subscribe((data: QueueITTransaction[]) => {
      
    });
    
  }

}
