import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {ApiService} from '../services/login';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(ApiService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};




// import { CanActivateFn, Router } from '@angular/router';
// import { inject } from '@angular/core';
// import { LoginService } from '../services/login';
//
// // Functional route guard: returns true if authenticated, otherwise redirects to login
// export const authGuard: CanActivateFn = () => {
//   const loginService = inject(LoginService);
//   const router = inject(Router);
//
//   if (loginService.isAuthenticated()) {
//     return true;
//   }
//   return router.createUrlTree(['']);
// };
