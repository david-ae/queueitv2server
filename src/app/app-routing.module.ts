import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'admin' },
  { path: 'admin', loadChildren: './admin/admin.module#AdminModule' },
  { path: 'operations', loadChildren: './operations/operations.module#OperationsModule' }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
