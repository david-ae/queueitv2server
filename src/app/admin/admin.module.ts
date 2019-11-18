import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from './container/container.component';
import { routing } from './admin.routing';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { TransactiontypeComponent } from './transactiontype/transactiontype.component';
import { UsersComponent } from './users/users.component';
import { RolesComponent } from './roles/roles.component';
import { StatusComponent } from './status/status.component';
import { ReportComponent } from './report/report.component';
import { Configuration } from '../config';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RoleFacade } from '../services/admin/rolefacade';
import { MobxAngularModule } from 'mobx-angular';
import { StatusFacade } from '../services/admin/statusfacade';
import { TransactionTypeFacade } from '../services/admin/transactiontypefacade';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import {NgxPaginationModule} from 'ngx-pagination';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReportFacade } from '../services/admin/reportsfacade';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TransactionPipe } from './pipes/transaction.pipe';
import { ManageuserprofileComponent } from './manageuserprofile/manageuserprofile.component';
import { ChangeuserpasswordComponent } from './changeuserpassword/changeuserpassword.component';
import { ManageuserroleComponent } from './manageuserrole/manageuserrole.component';
import { UserFacade } from '../services/admin/userfacade';
import { UserPipe } from './pipes/user.pipe';
import { SharedModule } from '../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { LoginComponent } from './login/login.component';
import { UserAccess } from './services/userAccess';
import { GetnewuserprofileComponent } from './getnewuserprofile/getnewuserprofile.component';
import { TransactionTypePipe } from './pipes/transaction-type.pipe';
import { StatusPipe } from './pipes/status.pipe';
import { PlatenumberPipe } from './pipes/platenumber.pipe';
import { TellerPipe } from './pipes/teller.pipe';
import { SearchPipe } from './pipes/search.pipe';
import { MomentModule } from 'ngx-moment';
import { TokenInterceptor } from '../helpers/tokeninterceptor';

@NgModule({
  declarations: [
    ContainerComponent, 
    DashboardComponent, 
    TransactiontypeComponent, 
    UsersComponent, 
    RolesComponent, 
    StatusComponent, 
    ReportComponent, 
    TransactionPipe, 
    ManageuserprofileComponent, 
    ChangeuserpasswordComponent, 
    ManageuserroleComponent,
    UserPipe,
    LoginComponent,
    GetnewuserprofileComponent,
    TransactionTypePipe,
    StatusPipe,
    PlatenumberPipe,
    TellerPipe,
    SearchPipe
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgSelectModule,
    MomentModule.forRoot({
      relativeTimeThresholdOptions: {
        'm': 59
      }
    }),
    SharedModule,
    FormsModule,
    routing
  ],
  providers: [
    Configuration, 
    RoleFacade, 
    StatusFacade, 
    TransactionTypeFacade, 
    ReportFacade, 
    UserAccess,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    UserFacade,
    NgxSpinnerService
  ],
  exports:[NgxSpinnerModule]
})
export class AdminModule { }
