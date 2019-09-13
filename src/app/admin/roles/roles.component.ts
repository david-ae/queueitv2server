import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { GeneralService } from '../services/general.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Role } from 'src/app/domainmodel/role';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RoleFacade } from 'src/app/services/admin/rolefacade';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/shared/_services';

@Component({
  selector: 'app-roles',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {

  buttonName: string = "Add Role";
  roleForm: FormGroup;

  p: number = 1;
  collection: any[] = this.roleFacade.roles;

  constructor(public roleFacade: RoleFacade, private _generalService: GeneralService,
    private spinner: NgxSpinnerService, public alertService: AlertService) { 
    this.roleForm = new FormGroup({
      rolename: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
  }

  addRole(name: string){
    this.spinner.show();
  
    this._generalService.addRole(name)
    .subscribe((data: Role) => {
      this.spinner.hide();
      this.alertService.success(name.toUpperCase() + " Successfully Added as a Role.")
        this.roleFacade.roles.push(data);
    },
    (err: HttpErrorResponse) => {
      // this.spinner.hide();
      console.log("Error: " + err);
      this.alertService.error("New Role Addition Failed. Please try again.");
    });
  }

  editRole(id: any){
    this.roleFacade.role = this.roleFacade.getRole(id);
    this.roleForm.setValue({
       rolename: this.roleFacade.role.name
    });
    this.buttonName = "Update Role";
  }

  updateRole(){
    this.spinner.show();
    let role = new Role();
    role.id = this.roleFacade.role.id;
    role.name = this.roleForm.get("rolename").value;

    this._generalService.updateRole(role)
      .subscribe(() => {
        this.spinner.hide();
        this.roleFacade.updateRole(role);
        this.alertService.success("Role Update Successful");
      },
          (err: HttpErrorResponse) => {
            this.spinner.hide();
              console.log("Error: " + err);
              this.alertService.error("Role Update Failed. Please try again");
          }
      );
      this.roleForm.reset();
    this.buttonName = "Add Role";
  }

}
