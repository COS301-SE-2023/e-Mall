/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { RouterState } from '@ngxs/router-plugin';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { IRouteBreadcrumb } from '../models/route-breadcrumb.interface';

@Injectable()
export class RouteBreadcrumbFacade {
  @Select(RouterState.state) routerState$!: Observable<any>;

  getBreadcrumbs(routerState: any): IRouteBreadcrumb[] {
    const crumbs: IRouteBreadcrumb[] = [];
    let hasHomeBreadcrumb = false;
    const url = routerState.url;
    if (url) {
      const segments = url.split('/');
      let currentUrl = '';
      for (const segment of segments) {
        if (segment) {
          currentUrl += '/' + segment;
          const label = segment.charAt(0).toUpperCase() + segment.slice(1);
          crumbs.push({
            label,
            url: currentUrl,
          });
          if (label === 'Home') {
            hasHomeBreadcrumb = true;
          }
        }
      }
      if (!hasHomeBreadcrumb) {
        crumbs.unshift({ label: 'Home', url: '/home' });
      }
    }
    return crumbs;
  }
}
