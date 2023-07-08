import { AnimationController } from '@ionic/angular';
const animationCtrl = new AnimationController();
export const customPageAnimation = (_: HTMLElement, opts: any) => {
  // create root transition
  const rootTransition = animationCtrl
    .create()
    .duration(opts.duration || 250)
    .easing('cubic-bezier(0.7,0,0.3,1)');

  const enterTransition = animationCtrl
    .create()
    .addElement(opts.enteringEl.querySelector('ion-content'));
  const exitTransition = animationCtrl
    .create()
    .addElement(opts.leavingEl.querySelector('ion-content'));

  enterTransition.fromTo('opacity', '0', '1');
  exitTransition.fromTo('opacity', '1', '0');

  if (opts.direction === 'forward') {
    enterTransition.fromTo('transform', 'translateY(-1.5%)', 'translateY(0%)');
    exitTransition.fromTo('transform', 'translateY(0%)', 'translateY(1.5%)');
  } else {
    enterTransition.fromTo('transform', 'translateY(1.5%)', 'translateY(0%)');
    exitTransition.fromTo('transform', 'translateY(0%)', 'translateY(-1.5%)');
  }

  rootTransition.addAnimation([enterTransition, exitTransition]);
  return rootTransition;
};
