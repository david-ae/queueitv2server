import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from './container/container.component';
import { JobComponent } from './job/job.component';
import { CollectionsComponent } from './collections/collections.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MobxAngularModule } from 'mobx-angular';
import { routing } from './operations.routing';
import { ProcesstransactionsComponent } from './processtransactions/processtransactions.component';
import { TransactionService } from './services/transaction.service';
import { TransactionStore } from '../store/operations/transaction';
import { StatusreportbarComponent } from './statusreportbar/statusreportbar.component';
import { TransactionPipe } from './pipes/transaction.pipe';
import { TellertransactionPipe } from './pipes/tellertransaction.pipe';
import { TellerStore } from '../store/operations/teller';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../shared/shared.module';
import { OperationsFacade } from '../services/operations/operationsfacade';
import { TransactionTypeFacade } from '../services/admin/transactiontypefacade';
import { RoleFacade } from '../services/admin/rolefacade';
import { StatusFacade } from '../services/admin/statusfacade';
import { ReportFacade } from '../services/admin/reportsfacade';
import { UserFacade } from '../services/admin/userfacade';
import { LoginComponent } from './login/login.component';
import { FooterComponent } from './footer/footer.component';
import { GetnewuserprofileComponent } from './getnewuserprofile/getnewuserprofile.component';
import { UserAccess } from './services/userAccess';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Configuration } from '../config';

@NgModule({
  declarations: [
    ContainerComponent, 
    JobComponent, 
    CollectionsComponent, 
    ProcesstransactionsComponent, 
    StatusreportbarComponent, 
    TransactionPipe, 
    TellertransactionPipe, LoginComponent, FooterComponent, GetnewuserprofileComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    SharedModule,   
    routing
  ],
  providers: [
    TransactionService, 
    TransactionStore, 
    TellerStore, 
    OperationsFacade,
    TransactionTypeFacade,
    RoleFacade,
    NgxSpinnerService,
    StatusFacade,
    ReportFacade,
    UserFacade,
    UserAccess,
    Configuration
  ],
  exports:[TransactionPipe, NgxSpinnerModule,
    TellertransactionPipe]
})
export class OperationsModule { }
