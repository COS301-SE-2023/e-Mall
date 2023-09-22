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

  constructor(private loadingController: LoadingController) {
    this.loadingSubs = this.loading
      .pipe(debounceTime(500))
      .subscribe(async isLoading => {
        if (isLoading) {
          console.log('isLoading', isLoading);
          await this.presentLoading();
          console.log('finished loader presenting');
        } else {
          console.log('isDismmising', isLoading);
          await this.dismissLoading();
        }
      });
  }

  ngOnDestroy(): void {
    if (this.loadingSubs) {
      console.log('page loader service destroyed');
      this.dismissLoading();
      this.loadingSubs.unsubscribe();
    }
  }

  async presentLoading() {
    // console.log(this.loader);
    if (this.loader === null || this.loader === undefined) {
      this.loader = undefined;
      this.loader = await this.loadingController.create({
        spinner: 'dots',
        message: 'Please wait...',
        translucent: true,
        backdropDismiss: false,
        //mode: 'ios',
        // duration: 5000,
        cssClass: 'custom-loader',
      });
      await this.loader.present();
      console.log('presenting loading from loader');
    }
  }

  async dismissLoading() {
    if (this.loading) {
      await this.loader?.dismiss();
      this.loader = null;
      console.log('dismissed loading from loader');
    }
  }
  onImageLoaded() {
    this.loading.next(false);
  }
  onImageStartLoading() {
    this.loading.next(true);
  }
}
