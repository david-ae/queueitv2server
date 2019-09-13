import { Routes, RouterModule } from "@angular/router";
import { ContainerComponent } from './container/container.component';
import { JobComponent } from './job/job.component';
import { CollectionsComponent } from './collections/collections.component';
import { ModuleWithProviders } from '@angular/core';
import { ProcesstransactionsComponent } from './processtransactions/processtransactions.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
    {
        path: 'operations',
        component: ContainerComponent,

        children: [
            { path: '', pathMatch: 'full', redirectTo: 'login' },            
            { path: 'login', component: LoginComponent },
            { path: 'process-jobs', component: JobComponent },
            { path: 'checkout-jobs', component: CollectionsComponent },
            { path: 'process-transactions', component: ProcesstransactionsComponent }
        ]
    }    
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);