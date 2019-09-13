import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { ContainerComponent } from './container/container.component';
import { JobComponent } from './job/job.component';
import { CollectionsComponent } from './collections/collections.component';
import { ProcesstransactionsComponent } from './processtransactions/processtransactions.component';
import { StatusreportbarComponent } from './statusreportbar/statusreportbar.component';
import { LoginComponent } from './login/login.component';
import { FooterComponent } from './footer/footer.component';
import { GetnewuserprofileComponent } from './getnewuserprofile/getnewuserprofile.component';

@NgModule({
  declarations: [ContainerComponent, JobComponent, CollectionsComponent, ProcesstransactionsComponent, StatusreportbarComponent, LoginComponent, FooterComponent, GetnewuserprofileComponent],
  imports: [
    NativeScriptCommonModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class OperationsModule { }
