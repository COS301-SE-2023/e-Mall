import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { INotification } from '@features/notification/models/notification.interface';
import { NotificationFacade } from '@features/notification/services/notification.facade';
import { ViewWillEnter } from '@ionic/angular';
import { Subscription, combineLatest } from 'rxjs';

@Component({
  selector: 'app-notification-card',
  templateUrl: './notification-card.component.html',
  styleUrls: ['./notification-card.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationCardComponent implements OnInit, OnDestroy {
  @Input() item!: INotification;
  @Input() calculatedTime!: string;
  test: any =
    '<ion-button>this is test message</ion-button><ion-label>hello</ion-label>';
  // menuSubs = new Subscription();
  // custom_time = '';
  constructor(
    private sanitizer: DomSanitizer // private cdr: ChangeDetectorRef // private notificationFacade: NotificationFacade,
  ) {}

  ngOnInit(): void {
    //   this.menuSubs = combineLatest([
    //     this.notificationFacade.isMenuOpen$,
    //     this.notificationFacade.count$,
    //   ]).subscribe(([isOpen, count]) => {
    //     console.log('count ', count);
    //     if (isOpen) {
    //       console.log('calculate!');
    //       this.custom_time = this.calculateTime();
    //       this.cdr.markForCheck();
    //     }
    //   });
  }
  getSafeHtml(test: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(test);
  }
  ngOnDestroy(): void {
    // this.menuSubs.unsubscribe();
  }
}
