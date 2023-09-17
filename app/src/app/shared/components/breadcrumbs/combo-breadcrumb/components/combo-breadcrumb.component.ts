/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';

import { IComboBreadcrumb } from '../models/combo-breadcrumb.interface';
import { ComboBreadcrumbFacade } from '../services/combo-breadcrumb.facade';

@Component({
  selector: 'app-combo-breadcrumb',
  templateUrl: './combo-breadcrumb.component.html',
  styleUrls: ['./combo-breadcrumb.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComboBreadcrumbComponent implements OnInit {
  @Input()
  combo: any;

  crumbs: IComboBreadcrumb[] = [];
  constructor(public comboBreadcrumbFacade: ComboBreadcrumbFacade) {}

  ngOnInit(): void {
    this.crumbs = this.comboBreadcrumbFacade.getBreadcrumbs(this.combo);
  }

  navigateTo(url: string): void {
    this.comboBreadcrumbFacade.navigateTo(url);
  }
}
