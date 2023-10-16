import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { IError } from '../../../features/error/models/error.interface';
import { Subscription, Observable, take } from 'rxjs';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent implements OnDestroy {
  duration = 3000;
  subs: Subscription | null;
  constructor(private toastController: ToastController) {
    this.subs = null;
  }

  async presentErrorToast(error: Observable<IError | null>) {
    this.subs = error.pipe(take(1)).subscribe(async (err: IError | null) => {
      if (err) {
        const toast = await this.toastController.create({
          header: 'An error has occurred:',
          message: `${err.message}`,
          duration: this.duration,
          position: 'bottom',
          cssClass: 'error-toast',
        });

        await toast.present();
      }
    });
  }
  async presentSuccessToast(message: string) {
    const toast = await this.toastController.create({
      header: 'Success',
      message,
      duration: this.duration,
      position: 'bottom',
      cssClass: 'success-toast',
    });

    await toast.present();
  }

  async presentWarningToast(error: Observable<IError | null>) {
    this.subs = error.pipe(take(1)).subscribe(async (err: IError | null) => {
      if (err) {
        const toast = await this.toastController.create({
          header: 'Warning',
          message: `${err.message}`,
          duration: this.duration,
          position: 'bottom',
          cssClass: 'warning-toast',
        });

        await toast.present();
      }
    });
  }
  async presentErrorToastWithMessage(message: string) {
    // this.subs = error.pipe(take(1)).subscribe(async (err: IError | null) => {
    // if (err) {
    const toast = await this.toastController.create({
      header: 'An error has occurred:',
      message: message,
      duration: this.duration,
      position: 'bottom',
      cssClass: 'error-toast',
    });

    await toast.present();
    // }
    // });
  }
  // async presentSuccessToast(message: string) {
  //   const toast = await this.toastController.create({
  //     header: 'Success:',
  //     message: message,
  //     duration: this.duration,
  //     position: 'bottom',
  //     cssClass: 'success-toast_temp',
  //   });

  //   await toast.present();
  // }
  ngOnDestroy(): void {
    if (this.subs) this.subs.unsubscribe();
  }
}
