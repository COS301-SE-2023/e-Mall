/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Observable, debounceTime, map, merge, Subscription } from 'rxjs';
import { ActionType, Store } from '@ngxs/store';

import {
  actionsExecuting,
  ActionsExecuting,
} from '@ngxs-labs/actions-executing';
@Injectable({
  providedIn: 'root',
})
export class LoaderFacade {
  private loading: HTMLIonLoadingElement | null | undefined;
  private actionsToWatch: ActionType[] = [];
  private actions$!: Observable<ActionsExecuting>;
  private loadingSubs = new Subscription();
  constructor(
    private loadingController: LoadingController,
    private stroe: Store
  ) {
    this.loading = null;

    this.watch();
  }

  watch() {
    if (this.loadingSubs) {
      this.loadingSubs.unsubscribe();
    }
    this.actions$ = this.stroe.select(actionsExecuting(this.actionsToWatch));
    this.loadingSubs = merge(
      this.actions$.pipe(map(() => true)),
      this.actions$.pipe(
        debounceTime(2000),
        map(() => false)
      )
    ).subscribe(async shouldPresent => {
      console.log(shouldPresent);
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
      console.log('presenting loading from loader');
    }
  }

  async dismissLoading() {
    if (this.loading) {
      await this.loading.dismiss();
      this.loading = null;
      console.log('dismissed loading from loader');
    }
  }

  addActions(actions: ActionType[]) {
    const uniqueActions = actions.filter(
      action => !this.actionsToWatch.includes(action)
    );
    this.actionsToWatch.push(...uniqueActions);
    this.watch();
  }

  removeActions(actions: ActionType[]) {
    console.error('before remove', this.actionsToWatch);
    this.actionsToWatch = this.actionsToWatch.filter(
      action => !actions.includes(action)
    );
    console.error('after remove', this.actionsToWatch);
    this.watch();
  }
}
