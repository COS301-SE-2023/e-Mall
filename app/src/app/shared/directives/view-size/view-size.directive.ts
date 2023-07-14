/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/directive-selector */
/* eslint-disable @typescript-eslint/naming-convention */
import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { Size, config } from './utils/view-size.util';
@Directive({
  selector: '[viewSize]',
})
export class ViewSizeDirective implements OnDestroy {
  private subscription = new Subscription();

  @Input('viewSize') set size(value: Size) {
    this.subscription.unsubscribe();
    this.subscription = this.observer
      .observe(config[value])
      .subscribe(this.updateView);
  }

  constructor(
    private observer: BreakpointObserver,
    private vcRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private cd: ChangeDetectorRef
  ) {}

  updateView = ({ matches }: BreakpointState) => {
    if (matches && !this.vcRef.length) {
      this.vcRef.createEmbeddedView(this.templateRef);
      this.cd.markForCheck();
    } else if (!matches && this.vcRef.length) {
      this.vcRef.clear();
      this.cd.markForCheck();
    }
  };

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
