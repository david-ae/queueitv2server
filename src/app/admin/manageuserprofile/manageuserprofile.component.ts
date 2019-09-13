import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GeneralService } from '../services/general.service';
import { UserFacade } from 'src/app/services/admin/userfacade';
import { UserVO } from 'src/app/valueobjects/userVO';
import { ManageUserApiModel } from '../apimodels/manageuserapimodel';
import { HttpErrorResponse } from '@angular/common/http';
import { RoleFacade } from 'src/app/services/admin/rolefacade';
import { Role } from 'src/app/domainmodel/role';
import { AlertService } from 'src/app/shared/_services';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-manageuserprofile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './manageuserprofile.component.html',
  styleUrls: ['./manageuserprofile.component.css']
})
export class ManageuserprofileComponent implements OnInit {  
  
  buttonName: string = "Add New User";
  manageUserForm: FormGroup;
  isLoading: boolean = true;

  p: number = 1;
  collection: any[] = this.userFacade.users;

  constructor(private _generalService: GeneralService, public userFacade: UserFacade,
     public roleFacade: RoleFacade, public alertService: AlertService,
     private spinner: NgxSpinnerService) { 
    this.manageUserForm = new FormGroup({
      firstname: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      id: new FormControl(''),
      isactive: new FormControl('')
    });
  }

  ngOnInit() {
    this.alertService.success("Works");
    this._generalService.getUsers()
        .subscribe((data: UserVO[]) => {
          this.userFacade.users = data;
        });
      this._generalService.getRoles()
        .subscribe((data: Role[]) => {
            this.roleFacade.roles = data;
        },
        (err: HttpErrorResponse) => {
            console.log("Error: " + err);
        }
    );
  }

  addUser(){
    this.spinner.show();
    let model = new ManageUserApiModel();
    model.firstname = this.manageUserForm.get("firstname").value;
    model.lastname = this.manageUserForm.get("lastname").value;
    model.email = this.manageUserForm.get("email").value;
    model.isactive = this.manageUserForm.get("isactive").value;

    this._generalService.register(model)
        .subscribe((data) => {
          if(data){
            this.spinner.hide();
            this.userFacade.user.identity = data.id;
            this.userFacade.user.email = data.email;
            this.userFacade.user.firstname = data.firstname;
            this.userFacade.user.lastname = data.lastname;
            this.userFacade.user.isActive = data.isactive;
            this.userFacade.users.push(this.userFacade.user);

            this.alertService.success(this.userFacade.user.firstname + " " + this.userFacade.user.lastname + " was successfully registered.")
          }  
        },
        (err: HttpErrorResponse) => {
          console.log("Error: " + err);
          this.alertService.error("Registration Failed. Please try again.");
        }
      );
  }

  editUser(id: any){
    this.userFacade.user = this.userFacade.getUser(id);
    this.manageUserForm.setValue({
       firstname: this.userFacade.user.firstname,
       lastname: this.userFacade.user.lastname,
       email: this.userFacade.user.email,
       id: this.userFacade.user.identity,
       isactive: this.userFacade.user.isActive
    });
    this.buttonName = "Update User";
  }

  deactivateUser(id: string){
    this.spinner.show();
    this._generalService.deactivateUser(id)
        .subscribe(() => { 
          this.spinner.hide();         
          let user = this.userFacade.getUser(id);
          this.userFacade.updateUser(user);                    
          this.userFacade.error = "works";
          this.alertService.success(this.userFacade.error);
        },
        (err: HttpErrorResponse) => {
          this.spinner.hide();
          console.log("Error: " + err);
          this.alertService.error("Deactivation Failed. Please try again!")          
      });
  }

  reactivateUser(id: any){
    this.spinner.show();
    this._generalService.reactivateUser(id)
        .subscribe(() => {
          this.spinner.hide();
          this.alertService.success("User Successfully Reactivated");
          let user = this.userFacade.getUser(id);
          this.userFacade.updateUser(user);
        },
        (err: HttpErrorResponse) => {
          this.spinner.hide();
          console.log("Error: " + err);
          this.alertService.error("Reactivation Failed. Please try again!")          
      });
  }

  updateUser(){
    this.spinner.show();
    let model = new ManageUserApiModel();
    model.firstname = this.manageUserForm.get("firstname").value;
    model.lastname = this.manageUserForm.get("lastname").value;
    model.email = this.manageUserForm.get("email").value;
    model.id = this.manageUserForm.get("id").value;
    this._generalService.updateUser(model)
        .subscribe(()=> {
          this.spinner.hide();
          this.userFacade.updateUser(this.userFacade.user);
        },
        (err: HttpErrorResponse) => {
          this.spinner.hide();
          console.log("Error: " + err);
          this.alertService.error("User Details Update Failed. Please try again.");
        }
      );

    this.manageUserForm.reset();
    this.buttonName = "Add New User";
  }
}
