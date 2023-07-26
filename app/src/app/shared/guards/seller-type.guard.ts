/* eslint-disable @typescript-eslint/no-unused-vars */
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthFacade } from '@features/auth/services/auth.facade';
//only seller can pass this
export const sellerTypeGuard: CanActivateFn = async (route, state) => {
  const authFacade = inject(AuthFacade);
  const router = inject(Router);
  if ((await authFacade.getUserType()) === 'seller') {
    // return router.parseUrl('/inventory');
    return true;
  }
  return false;
};
