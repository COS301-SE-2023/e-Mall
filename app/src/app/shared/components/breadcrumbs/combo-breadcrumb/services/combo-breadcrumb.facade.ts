/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { IComboBreadcrumb } from '../models/combo-breadcrumb.interface';
import { ICombo } from '@app/features/combo-state/models/combo.interface';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

@Injectable()
export class ComboBreadcrumbFacade {
  constructor(private router: Router, private route: ActivatedRoute) {}

  getBreadcrumbs(combo: ICombo | string): IComboBreadcrumb[] {
    const crumbs: IComboBreadcrumb[] = [
      { label: 'Home', url: '/home' },
      { label: 'My Collections', url: 'my-collections' },
    ];

    if (typeof combo !== 'string' && combo !== undefined) {
      crumbs.push({ label: combo.name, url: `${combo.id}` });
    } else if (combo === undefined) {
      return crumbs;
    } else {
      crumbs.push({ label: 'My wishlist', url: `/wishlist` });
    }

    return crumbs;
  }

  navigateTo(url: string): void {
    if (
      url.includes('home') ||
      url.includes('my-collections') ||
      url.includes('wishlist')
    ) {
      this.router.navigate([url]);
    } else {
      const navigationextras: NavigationExtras = {
        queryParams: { collection_id: Number(url) },
      };
      this.router.navigate(['/collection'], navigationextras);
    }
  }
}
