import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthFacade } from '@features/auth/services/auth.facade';

export const authGuard: CanActivateFn = async (route, state) => {
  const authFacade = inject(AuthFacade);
  const router = inject(Router);
  if (await authFacade.isLoggedIn()) {
    return true;
  }
  authFacade.setRedirectUrl(state.url);
  return router.parseUrl('/sign-in');
};
