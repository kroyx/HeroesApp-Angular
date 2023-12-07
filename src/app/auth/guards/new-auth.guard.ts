import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn, CanMatchFn, Route,
  Router,
  RouterStateSnapshot, UrlSegment
} from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

const canActivate: CanActivateFn
  = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> => {
  return checkAuthStatus();
};

const canMatch: CanMatchFn =
  (route: Route, segments: UrlSegment[]): boolean | Observable<boolean> => {
    return checkAuthStatus();
  };

const checkAuthStatus = (): boolean | Observable<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.checkAuthentication()
    .pipe(
      tap(isAuthenticated => {
        if (!isAuthenticated) {
          router.navigate([ './auth/login' ]);
        }
      })
    );
};

export const NewAuthGuard = {
  canActivate,
  canMatch,
};
