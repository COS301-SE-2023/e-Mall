/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/directive-selector */
/* eslint-disable @typescript-eslint/naming-convention */
import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  OnDestroy,
} from '@angular/core';
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
// @Directive({
//   selector: '[media]',
// })
// export class MediaDirective {
//   @Input() set media(query: string) {
//     if (this.removeListener) this.removeListener();
//     this.setListener(query);
//   }
//   private hasView = false;
//   private removeListener: (() => void) | undefined;

//   constructor(
//     private readonly viewContainer: ViewContainerRef,
//     private readonly template: TemplateRef<any>
//   ) {}

//   private setListener(query: string) {
//     const mediaQueryList = window.matchMedia(query);
//     const listener = (event: any) => {
//       if (event.matches && !this.hasView) {
//         this.hasView = true;
//         this.viewContainer.createEmbeddedView(this.template);
//       }
//       if (!event.matches && this.hasView) {
//         this.hasView = false;
//         this.viewContainer.clear();
//       }
//     };
//     listener(mediaQueryList);
//     mediaQueryList.addEventListener('change', listener);
//     this.removeListener = () =>
//       mediaQueryList.removeEventListener('change', listener);
//   }
// }
type Size = 'mobile' | 'desktop';

const config = {
  mobile: [Breakpoints.Small, Breakpoints.XSmall],
  desktop: [Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge],
};

@Directive({
  // standalone: true,
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
    private templateRef: TemplateRef<any>
  ) {}

  updateView = ({ matches }: BreakpointState) => {
    if (matches && !this.vcRef.length) {
      this.vcRef.createEmbeddedView(this.templateRef);
    } else if (!matches && this.vcRef.length) {
      this.vcRef.clear();
    }
  };

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
