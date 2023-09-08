import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
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
  // menuSubs = new Subscription();
  // custom_time = '';
  constructor() // private notificationFacade: NotificationFacade,
  // private cdr: ChangeDetectorRef
  {}

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

  ngOnDestroy(): void {
    // this.menuSubs.unsubscribe();
  }
}
