/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouteBreadcrumbFacade } from '../services/route-breadcrumb.facade';

@Component({
  selector: 'app-route-breadcrumb',
  templateUrl: './route-breadcrumb.component.html',
  styleUrls: ['./route-breadcrumb.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouteBreadcrumbComponent {
  constructor(public routeBreadcrumbFacade: RouteBreadcrumbFacade) {}
}
