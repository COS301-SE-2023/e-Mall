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
          message: `Error: ${err.message}`,
          duration: this.duration,
          position: 'bottom',
          cssClass: 'error-toast',
        });

        await toast.present();
      }
    });
  }
  ngOnDestroy(): void {
    if (this.subs) this.subs.unsubscribe();
  }
}
