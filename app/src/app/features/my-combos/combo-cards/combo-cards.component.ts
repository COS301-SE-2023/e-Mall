/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, Input, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { Observable, of, Subscription, BehaviorSubject } from 'rxjs';


@Component({
  selector: 'app-combo-cards',
  templateUrl: 'combo-cards.component.html',
  styleUrls: ['combo-cards.component.scss'],
})
export class ComboCardComponent implements OnInit {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() combo: any;
  consumer_id!: string;
  consumer_email!: string;
  constructor(
    private router: Router,
  ) {}
  ngOnInit(): void {}
  
  
  goToComboPage(): void {
    // Create the navigation extras object with the search query as a parameter

  }
  getOneImg(imgList?: string[]) {
    //remove following when no need to have mock data
    if (!imgList || imgList.length < 1){
      return 'https://www.incredible.co.za/media/catalog/product/cache/7ce9addd40d23ee411c2cc726ad5e7ed/s/c/screenshot_2022-05-03_142633.jpg';
    }
    return imgList[0];
  }
  
}
