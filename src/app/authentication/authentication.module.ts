import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from './container/container.component';
import { LoginComponent } from './login/login.component';
import { routing } from './authentication.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserAccess } from '../services/authentication/usersAccess';
import { GetnewuserprofileComponent } from './getnewuserprofile/getnewuserprofile.component';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [ContainerComponent, LoginComponent, GetnewuserprofileComponent,],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    SharedModule,
    routing
  ],
  providers: [UserAccess, NgxSpinnerService]
})
export class AuthenticationModule { }
