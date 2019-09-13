import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { ContainerComponent } from './container/container.component';
import { LoginComponent } from './login/login.component';
import { GetnewuserprofileComponent } from './getnewuserprofile/getnewuserprofile.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  declarations: [ContainerComponent, LoginComponent, GetnewuserprofileComponent, HeaderComponent, SidebarComponent],
  imports: [
    NativeScriptCommonModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AuthenticationModule { }
