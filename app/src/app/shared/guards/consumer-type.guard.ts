/* eslint-disable @typescript-eslint/no-unused-vars */
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthFacade } from '@features/auth/services/auth.facade';
//only consumer type can pass this
export const consumerTypeGuard: CanActivateFn = async (route, state) => {
  const authFacade = inject(AuthFacade);
  const router = inject(Router);
  if ((await authFacade.getUserType()) === 'consumer') {
    return true;
  }
  return router.parseUrl('/inventory');
};
