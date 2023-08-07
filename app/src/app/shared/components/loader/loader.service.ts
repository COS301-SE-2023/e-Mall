/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, Type } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { BehaviorSubject, debounceTime, map, merge } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private loading: HTMLIonLoadingElement | null | undefined;
  private actionsToWatch$ = new BehaviorSubject<Type<any>[]>([]);
  constructor(private loadingController: LoadingController) {
    this.loading = null;
    merge(
      this.actionsToWatch$.pipe(map(() => true)),
      this.actionsToWatch$.pipe(
        debounceTime(2000),
        map(() => false)
      )
    ).subscribe(async shouldPresent => {
      if (shouldPresent) {
        this.presentLoading();
      } else {
        this.dismissLoading();
      }
    });
  }

  async presentLoading() {
    if (this.loading === null) {
      this.loading = undefined;
      this.loading = await this.loadingController.create({
        spinner: 'dots',
        message: 'Please wait...',
        mode: 'ios',
      });
      await this.loading.present();
      console.log('presenting loading');
    }
  }

  async dismissLoading() {
    if (this.loading) {
      await this.loading.dismiss();
      this.loading = null;
      console.log('dismissed loading');
    }
  }

  addActions(actions: Type<any>[]) {
    const uniqueActions = actions.filter(
      action => !this.actionsToWatch$.value.includes(action)
    );
    this.actionsToWatch$.next([
      ...this.actionsToWatch$.value,
      ...uniqueActions,
    ]);
  }

  removeActions(actions: Type<any>[]) {
    this.actionsToWatch$.next(
      this.actionsToWatch$.value.filter(a => !actions.includes(a))
    );
  }
}
