/* eslint-disable @typescript-eslint/no-unused-vars */
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthFacade } from '@features/auth/services/auth.facade';

export const routeGuard: CanActivateFn = async (route, state) => {
  const authFacade = inject(AuthFacade);
  const router = inject(Router);
  if (await authFacade.isLoggedIn()) {
    return router.parseUrl('/home');
  }
  return true;
};
