import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { ContainerComponent } from './container/container.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RolesComponent } from './roles/roles.component';
import { StatusComponent } from './status/status.component';
import { TransactiontypeComponent } from './transactiontype/transactiontype.component';
import { ReportComponent } from './report/report.component';
import { ManageuserprofileComponent } from './manageuserprofile/manageuserprofile.component';
import { ManageuserroleComponent } from './manageuserrole/manageuserrole.component';
import { ChangeuserpasswordComponent } from './changeuserpassword/changeuserpassword.component';
import { LoginComponent } from './login/login.component';
import { GetnewuserprofileComponent } from './getnewuserprofile/getnewuserprofile.component';
import { AuthGuard } from '../services/authentication/auth.guard';

const routes: Routes = [
    {
        path: 'admin',
        component: ContainerComponent,        

        children: [
            { path: '', pathMatch: 'full', redirectTo: 'login' },
            { path: 'login', component: LoginComponent },
            { path: 'getnewuserprofile', component: GetnewuserprofileComponent, canActivate: [AuthGuard] },
            { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
            { path: 'roles', component: RolesComponent, canActivate: [AuthGuard] } ,
            { path: 'transactiontypes', component: TransactiontypeComponent, canActivate: [AuthGuard] },
            { path: 'status', component: StatusComponent, canActivate: [AuthGuard] },
            { path: 'transaction-report', component: ReportComponent, canActivate: [AuthGuard] },
            { path: 'update-user-profile', component: ManageuserprofileComponent, canActivate: [AuthGuard] },
            { path: 'update-user-role', component: ManageuserroleComponent, canActivate: [AuthGuard] },
            { path: 'change-user-password', component: ChangeuserpasswordComponent, canActivate: [AuthGuard] }
        ]
    }    
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);