import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleGuardService as RoleGuard } from './services/roleGuard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
   },
  {
    path: 'home',
    loadChildren: './modules/home/home.module#HomeModule',
    canActivate: [RoleGuard],
    data: {
      expectedRole: ['decorasaurus_admin', 'decorasaurus_producer']
    }
  },
  {
    path: 'order',
    loadChildren: './modules/order/order.module#OrderModule',
    canActivate: [RoleGuard],
    data: {
      expectedRole: ['decorasaurus_admin', 'decorasaurus_producer']
    }
  },
  {
    path: 'orders',
    loadChildren: './modules/orders/orders.module#OrdersModule',
    canActivate: [RoleGuard],
    data: {
      expectedRole: ['decorasaurus_admin', 'decorasaurus_producer']
    }
  },
  { path: 'login', loadChildren: './modules/login/login.module#LoginModule' },
  { path: '**', loadChildren: './modules/not-found/not-found.module#NotFoundModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
