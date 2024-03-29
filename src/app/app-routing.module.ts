import { NgModule } from '@angular/core';
import { inject } from '@angular/core/testing';
import { RouterModule, Routes } from '@angular/router';
import { NewAuthGuard, NewPublicGuard } from './auth/guards';
import { AuthGuard } from './auth/guards/auth.guard';
import { PublicGuard } from './auth/guards/public.guard';
import { Error404PageComponent } from './shared/pages/error404-page/error404-page.component';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
    // canActivate: [PublicGuard],
    // canMatch: [PublicGuard]
    canActivate: [NewPublicGuard.canActivate],
    canMatch: [NewPublicGuard.canMatch],
  },
  {
    path: 'heroes',
    loadChildren: () => import('./heroes/heroes.module').then(m => m.HeroesModule),
    // canActivate: [AuthGuard],
    // canMatch: [AuthGuard]
    canActivate: [NewAuthGuard.canActivate],
    canMatch: [NewAuthGuard.canMatch],
  },
  {
    path: '404',
    component: Error404PageComponent
  },
  {
    path: '',
    redirectTo: 'heroes',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
