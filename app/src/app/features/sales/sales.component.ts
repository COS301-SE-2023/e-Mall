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
  templateUrl: 'sales.component.html',
  styleUrls: ['sales.component.scss'],
})
export class SalesComponent implements OnInit {
  productPerformanceChart: any;
  public productClicksChart: Chart | undefined;
  sellerName!: string | undefined;
  productsClicked = 0;
  websiteClicks = 0;
  favourited = 0;
  conversionRateData$: Observable<any> | undefined;
  categoryPercentageData$: Observable<any> | undefined;
  table_product_clicks!: number[];
  table_labels!: string[];
  table_link_clicks: number[] = [];
  table_favourites: number[] = [];
  conversionRateLabels!: string[];
  conversionRate!: number[];
  categories!: string[];
  categoryPercentage!: number[];
  showSpinner = true;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(
    private analytics: AnalyticsService,
    private profileFacade: ProfileFacade
  ) {}

  ngOnInit() {

    this.showSpinner = true;
    
    setTimeout(() => {
      this.showSpinner = false;
      
    }, 6000);
    
    console.log('sales component initialized');
    this.profileFacade.getProfile().subscribe(profile => {
      if (profile) {
        if ('business_name' in profile.details) {
          this.sellerName = profile.details.business_name;
        }
      }
    });
    this.analytics.getAnalyticsData(this.sellerName).subscribe(data => {
      this.productsClicked = data.product_clicks;
      this.websiteClicks = data.link_clicks;
      this.favourited = data.favourites;
    });

    this.analytics.getConversionRate(this.sellerName).subscribe(data => {
      this.conversionRateData$ = of(data);
      this.conversionRateData$.subscribe(data => {
        this.conversionRate = data.map(
          (item: { [x: string]: any }) => item['conversion_rate']
        );
        this.conversionRateLabels = data.map(
          (item: { [x: string]: any }) => item['product_name']
        );
      });

      this.createProductPerformanceChart();
    });

    this.analytics.getCategoryPercentage(this.sellerName).subscribe(data => {
      this.categoryPercentageData$ = of(data);
      this.categoryPercentageData$.subscribe(data => {
        this.categories = data.map(
          (item: { [x: string]: any }) => item['category']
        );
        this.categoryPercentage = data.map(
          (item: { [x: string]: any }) => item['percentage']
        );
      });
      this.createCategoryPercentageChart();
    });
    Chart.register(...registerables);
  }

  createProductPerformanceChart() {
    const productPerformanceCanvas = document.getElementById(
      'product-performance-chart'
    ) as HTMLCanvasElement;

    this.productPerformanceChart = new Chart(productPerformanceCanvas, {
      type: 'bar',
      data: {
        labels: this.conversionRateLabels,
        datasets: [
          {
            label: 'Product Performance',
            data: this.conversionRate,
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            borderRadius: 5,
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Product Performance',
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              callback: (value: string | number) => {
                const stringValue =
                  this.conversionRateLabels[Number(value)].toString();
                return stringValue.length > 10
                  ? stringValue.slice(0, 10) + '...'
                  : stringValue;
              },
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 10,
            },
          },
        },
        responsive: true,
      },
    });
  }

  createCategoryPercentageChart() {
    const categoryPercentageCanvas = document.getElementById(
      'categoryPercentage-chart'
    ) as HTMLCanvasElement;

    const categoryPercentageChart = new Chart(categoryPercentageCanvas, {
      type: 'bar',
      data: {
        labels: this.categories,
        datasets: [
          {
            label: 'Category Percentage',
            data: this.categoryPercentage,
            backgroundColor: 'rgba(0, 224, 150, 0.5)',
            borderColor: 'rgba(0, 224, 150, 1)',
            borderWidth: 1,
            borderRadius: 5,
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Category Percentage',
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              callback: (value: string | number) => {
                const stringValue = this.categories[Number(value)].toString();
                return stringValue.length > 10
                  ? stringValue.slice(0, 10) + '...'
                  : stringValue;
              },
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 10,
            },
          },
        },
        responsive: true,
      },
    });
  }
}
