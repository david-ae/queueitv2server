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

const routes: Routes = [
    {
        path: 'admin',
        component: ContainerComponent,

        children: [
            { path: '', pathMatch: 'full', redirectTo: 'login' },
            { path: 'login', component: LoginComponent },
            { path: 'getnewuserprofile', component: GetnewuserprofileComponent },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'roles', component: RolesComponent } ,
            { path: 'transactiontypes', component: TransactiontypeComponent },
            { path: 'status', component: StatusComponent },
            { path: 'transaction-report', component: ReportComponent },
            { path: 'update-user-profile', component: ManageuserprofileComponent },
            { path: 'update-user-role', component: ManageuserroleComponent },
            { path: 'change-user-password', component: ChangeuserpasswordComponent }
        ]
    }    
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);