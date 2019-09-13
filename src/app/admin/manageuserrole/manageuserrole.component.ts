import { Component, OnInit } from '@angular/core';
import { GeneralService } from '../services/general.service';
import { Role } from 'src/app/domainmodel/role';
import { RoleFacade } from 'src/app/services/admin/rolefacade';
import { HttpErrorResponse } from '@angular/common/http';
import { ManageUserRoleApiModel } from "../apimodels/manageuserroleapimodel";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserFacade } from 'src/app/services/admin/userfacade';
import { UserVO } from 'src/app/valueobjects/userVO';
import { AlertService } from 'src/app/shared/_services';

@Component({
  selector: 'app-manageuserrole',
  templateUrl: './manageuserrole.component.html',
  styleUrls: ['./manageuserrole.component.css']
})
export class ManageuserroleComponent implements OnInit {

  manageUserRoleForm: FormGroup;

  p: number = 1;
  collection: any[] = this.userFacade.users;

  constructor(private _generalService: GeneralService, public roleFacade: RoleFacade,
    private spinner: NgxSpinnerService, public userFacade: UserFacade,
    private alertService: AlertService) { 
    this.manageUserRoleForm = new FormGroup({
      email: new FormControl('', Validators.required),
      roleid: new FormControl('', Validators.required),
      id: new FormControl('')
    });
  }

  ngOnInit() {
    this.spinner.show();
    this._generalService.getUsers()
        .subscribe((data: UserVO[]) => {
          this.userFacade.users = data;
        });
    this._generalService.getRoles()
          .subscribe((data: Role[]) => {
            this.spinner.hide();
              this.roleFacade.roles = data;
          },
          (err: HttpErrorResponse) => {
              console.log("Error: " + err);
          }
      );
  }

  editUser(id: any){
    this.userFacade.user = this.userFacade.getUser(id);
    this.manageUserRoleForm.setValue({
       //roleid: this.,
       email: this.userFacade.user.email,
       id: this.userFacade.user.identity
    });
  }

  addRoleToUser(){
    this.spinner.show();
    let model = new ManageUserRoleApiModel();
    model.email = this.manageUserRoleForm.get("email").value;
    model.rolename = this.manageUserRoleForm.get("rolename").value;

    this._generalService.addRoleToUser(model)
        .subscribe(()=>{
          this.spinner.hide();
          this.alertService.success("Role Successful Added to User.");
        },
        (err: HttpErrorResponse) => {
          this.spinner.hide();
            console.log("Error: " + err);
            this.alertService.error("Adding Role to User Failed. Please try again.");
        }
        );
  }

  removeRoleFromUser(){
    this.spinner.show();
    let model = new ManageUserRoleApiModel();
    model.email = this.manageUserRoleForm.get("email").value;
    model.rolename = this.manageUserRoleForm.get("rolename").value;

    this._generalService.removeRoleFromUser(model)
        .subscribe(() => {
          this.spinner.hide();
          this.alertService.success("Role Removal Successful");
        },
        (err: HttpErrorResponse) => {
          this.spinner.hide();
            console.log("Error: " + err);
            this.alertService.error("Role Removal Failed. Please try again.");
        }
        );
  }
}
