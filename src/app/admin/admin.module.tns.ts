import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { ContainerComponent } from './container/container.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TransactiontypeComponent } from './transactiontype/transactiontype.component';
import { UsersComponent } from './users/users.component';
import { RolesComponent } from './roles/roles.component';
import { StatusComponent } from './status/status.component';
import { ReportComponent } from './report/report.component';
import { ManageuserprofileComponent } from './manageuserprofile/manageuserprofile.component';
import { ChangeuserpasswordComponent } from './changeuserpassword/changeuserpassword.component';
import { ManageuserroleComponent } from './manageuserrole/manageuserrole.component';
import { LoginComponent } from './login/login.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { GetnewuserprofileComponent } from './getnewuserprofile/getnewuserprofile.component';

@NgModule({
  declarations: [ContainerComponent, DashboardComponent, TransactiontypeComponent, UsersComponent, RolesComponent, StatusComponent, ReportComponent, ManageuserprofileComponent, ChangeuserpasswordComponent, ManageuserroleComponent, LoginComponent, FooterComponent, HomeComponent, GetnewuserprofileComponent],
  imports: [
    NativeScriptCommonModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AdminModule { }
