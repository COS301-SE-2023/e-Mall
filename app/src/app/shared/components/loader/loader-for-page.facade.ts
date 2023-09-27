/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, OnDestroy } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { debounceTime, Subscription, BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class PageLoaderFacade implements OnDestroy {
  public loading = new BehaviorSubject(false);
  private loader: HTMLIonLoadingElement | null | undefined;
  private loadingSubs = new Subscription();
  public loadingArray = [false];
  constructor(private loadingController: LoadingController) {
    this.loadingSubs = this.loading
      .pipe(debounceTime(500))
      .subscribe(async isLoading => {
        if (isLoading && !this.isStillLoading()) {
          this.loadingArray[0] = true;
          await this.presentLoading();
        } else {
          await this.dismissLoading();
        }
      });
  }

  ngOnDestroy(): void {
    if (this.loadingSubs) {
      this.dismissLoading();
      this.loadingSubs.unsubscribe();
    }
  }

  async presentLoading() {
    if (this.loader === null || this.loader === undefined) {
      // this.loader = undefined;
      this.loader = await this.loadingController.create({
        spinner: 'dots',
        message: 'Please wait...',
        translucent: true,
        backdropDismiss: false,
        mode: 'ios',
        // duration: 5000,
        cssClass: 'custom-loader',
      });
      await this.loader.present();
    }
  }

  async dismissLoading() {
    // if (this.loading) {
    await this.loader?.dismiss().then(() => {
      this.loader = null;
      this.loadingArray[0] = false;
    });
  }
  onImageLoaded(index: number) {
    this.loadingArray[index] = false;
    this.loading.next(false);
  }
  onImageStartLoading(index: number) {
    this.loadingArray[index] = true;
    this.loading.next(true);
  }
  isStillLoading() {
    return !this.loadingArray.every(val => val === false);
  }
}
