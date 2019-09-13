import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { ContainerComponent } from './container/container.component';
import { LoginComponent } from './login/login.component';
import { GetnewuserprofileComponent } from './getnewuserprofile/getnewuserprofile.component';

const routes: Routes = [
    {
        path: 'auth',
        component: ContainerComponent,

        children: [
            { path: '', pathMatch: 'full', redirectTo: 'login' },
            { path: 'login', component: LoginComponent },
            { path: 'getnewprofile', component: GetnewuserprofileComponent }        
        ]
    }    
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);