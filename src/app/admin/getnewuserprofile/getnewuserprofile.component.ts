import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserAccess } from './../services/userAccess';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../services/auth.service';
import { Accounts } from 'src/app/valueobjects/accountvo';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertService } from 'src/app/shared/_services';

@Component({
  selector: 'app-getnewuserprofile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './getnewuserprofile.component.html',
  styleUrls: ['./getnewuserprofile.component.css']
})
export class GetnewuserprofileComponent implements OnInit {

  getNewUserProfileForm: FormGroup;
  isNotNull: boolean = false;

  constructor(public userAccess: UserAccess, private spinner: NgxSpinnerService,
    private authService: AuthService, public alertService: AlertService) { 
    this.getNewUserProfileForm = new FormGroup({
      email: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
  }

  getNewUserProfile(){
    this.spinner.show();
    this.authService.getNewUserProfile(this.userAccess.user.email)
        .subscribe((data) => {
          if(data != null || data != undefined){
            this.spinner.hide();
            this.userAccess.user.identity = data.id;
            this.userAccess.user.email = data.email;
            this.userAccess.user.firstname = data.firstname;
            this.userAccess.user.lastname = data.lastname;
            this.userAccess.user.roles = data.roles;
            this.alertService.success("Yes! You now have a new profile. You can signin now.")
          }
          else{
            this.spinner.hide();
            this.alertService.error("Your new profile setup was unsuccessful. Please try again.");
          }          
        },
        (err: HttpErrorResponse) => {
          this.spinner.hide();
          this.alertService.error("Something went wrong. Please contact the IT Department.");
      });
  }

  getUserDetails(){
    this.spinner.show();
    let email = this.getNewUserProfileForm.get("email").value;
     this.authService.getUserOldAccount(email)
        .subscribe((data: Accounts) => {
          if(data != null || data != undefined){
            this.spinner.hide();
            this.userAccess.user.firstname = data.firstname;
            this.userAccess.user.lastname = data.lastname;
            this.userAccess.user.legacyId = data.identity;
            this.userAccess.user.email = data.username;
            this.userAccess.user.roles = data.roles;
            this.isNotNull = true;
            this.getNewUserProfileForm.setValue({
              email: this.userAccess.user.email
            });
          }else{
            this.spinner.hide();
            this.alertService.error("We can't find your account. Please contact IT Department.");
          }           
      },
      (err: HttpErrorResponse) => {
        this.spinner.hide();
        this.alertService.error("Something went wrong. Please try again.");
      });
  }

}
