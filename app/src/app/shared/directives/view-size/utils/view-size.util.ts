import { Breakpoints } from '@angular/cdk/layout';
export type Size = 'mobile' | 'desktop';

export const config = {
  xSmall: [Breakpoints.XSmall],
  mobile: [Breakpoints.Small, Breakpoints.XSmall],
  desktop: [Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge],
};
