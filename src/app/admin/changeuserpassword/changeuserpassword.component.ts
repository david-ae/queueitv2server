import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ChangePasswordApiModel } from '../apimodels/changepasswordapimodel';
import { GeneralService } from '../services/general.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-changeuserpassword',
  templateUrl: './changeuserpassword.component.html',
  styleUrls: ['./changeuserpassword.component.css']
})
export class ChangeuserpasswordComponent implements OnInit {

  changeUserPasswordForm: FormGroup;
  
  constructor(private _generalService: GeneralService, private spinner: NgxSpinnerService) { 
    this.changeUserPasswordForm = new FormGroup({
      email: new FormControl('', Validators.required),
      newpassword: new FormControl('', Validators.required),
      confirmnewpassword: new FormControl('')
    });
  }

  ngOnInit() {
  }

  changeUserPassword(){
    this.spinner.show();
    let model = new ChangePasswordApiModel();
    model.email = this.changeUserPasswordForm.get("email").value;
    model.newPassword = this.changeUserPasswordForm.get("newpassword").value;
    model.confirmNewPassword = this.changeUserPasswordForm.get("confirmnewpassword").value;

    this._generalService.changeNewPassword(model)
        .subscribe(() => {
          this.spinner.hide();
          this.changeUserPasswordForm.reset();
        });
  }
}
