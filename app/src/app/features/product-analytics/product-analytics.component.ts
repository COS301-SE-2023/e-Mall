/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Observable, of, Subscription } from 'rxjs';
import { AnalyticsService } from '@shared/servicies/analytics/analytics.service';
import { ProfileFacade } from '@features/profile/services/profile.facade';
interface ProductData {
  [productName: string]: {
    [month: string]: number;
  };
}
@Component({
  //selector: 'app-seller-dashboard',
  templateUrl: 'product-analytics.component.html',
  styleUrls: ['product-analytics.component.scss'],
})
export class ProductAnalyticsComponent implements OnInit {
  public productClicksChart: Chart | undefined;
  sellerName!: string | undefined;
  topProducts$: Observable<any> | undefined;
  productClicksData$: Observable<any> | undefined;
  table_product_clicks!: number[];
  table_labels!: string[];
  table_link_clicks: number[] = [];
  table_favourites: number[] = [];
  productNames!: string[];
  isChecked!: boolean;
  objCount = 0;
  productData: ProductData = {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(
    private analytics: AnalyticsService,
    private profileFacade: ProfileFacade
  ) {}

  ngOnInit() {
    this.productNames = [];
    this.profileFacade.getProfile().subscribe(profile => {
      if (profile) {
        if ('business_name' in profile.details) {
          // console.log(profile.details.business_name);
          this.sellerName = profile.details.business_name;
        }
      }
    });
    this.analytics.getAllProducts(this.sellerName).subscribe(data => {
      this.productClicksData$ = of(data);
      this.productClicksData$.subscribe(data => {
        this.topProducts$ = of(data);
        this.topProducts$.subscribe(data => {
          console.log('TOPPRODUCTS', data);
        });
        this.table_product_clicks = data.map(
          (item: { [x: string]: any }) => item['clicks']
        );
        this.table_labels = data.map(
          (item: { [x: string]: any }) => item['product_name']
        );
        this.table_favourites = data.map(
          (item: { [x: string]: any }) => item['favourites']
        );
        this.table_link_clicks = data.map(
          (item: { [x: string]: any }) => item['link_clicks']
        );
        // this.table_labels.forEach(label => {
        //   this.getSelectedProductData(label);
        // });
      });
    });
    Chart.register(...registerables);
  }

  createProductClicksChart() {
    const productClicksCanvas = document.getElementById(
      'product-clicks-chart'
    ) as HTMLCanvasElement;

    if (this.productClicksChart) {
      this.objCount = 0;
      this.productClicksChart.destroy();
    }

    const productNames = Object.keys(this.productData);
    const months = Object.keys(this.productData[productNames[0]]);
    const maxProductNameLength = 10;
    // Create datasets for each product
    const datasets = Object.keys(this.productData).map(productName => ({
      label:
        productName.length > maxProductNameLength
          ? productName.slice(0, maxProductNameLength) + '...'
          : productName,
      data: months.map(month => this.productData[productName][month] || 0),
      borderColor: this.getLineColor(),
      fill: false,
    }));
    // Create the line chart
    this.productClicksChart = new Chart(productClicksCanvas, {
      type: 'line',
      data: {
        labels: months,
        datasets: datasets,
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Top Product Clicks per Month',
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Months',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Number of Clicks',
            },
            beginAtZero: true,
            ticks: {
              stepSize: 5,
            },
          },
        },
        responsive: true,
      },
    });
  }

  getLineColor() {
    switch (this.objCount++) {
      case 0:
        return '#FFC0CB'; // Pink
      case 1:
        return '#0000FF'; // Blue
      case 2:
        return '#008000'; // Green
      case 3:
        return '#FF0000'; // Red
      case 4:
        return '#FFA500'; // Orange
      default:
        return '#000000'; // Black (default color)
    }
  }

  getSelectedProductData(product_name: string) {
    if (this.productNames.includes(product_name)) {
      this.productNames.splice(this.productNames.indexOf(product_name), 1);
    } else {
      this.productNames.push(product_name);
    }

    const data = {
      seller_name: this.sellerName,
      product_names: this.productNames,
    };
    const data1 = this.analytics.getSelectedProductData(data);
    data1.subscribe(data => {
      console.log('names:', this.productNames);
      this.productData[product_name] = data[product_name];
      this.createProductClicksChart();
    });
  }
}
