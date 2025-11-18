import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalStorageAuthService } from '../services/localstorage-auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  let auth = inject(LocalStorageAuthService);
  let router = inject(  Router);
  let authenticated = auth.user()!=null;
  if(!authenticated)
    router.navigate(['/login'],{state:{navigateTo:state.url}});
  return authenticated;
};
