import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Observable, of, Subscription } from 'rxjs';
import { AnalyticsService } from '@shared/servicies/analytics/analytics.service';

@Component({
  //selector: 'app-seller-dashboard',
  templateUrl: 'sales.component.html',
  styleUrls: ['sales.component.scss'],
})
export class SalesComponent implements OnInit {
  sellerName!: string | undefined;
  productsClicked = 0;
  websiteClicks = 0;
  favourited = 0;
  productClicksData$: Observable<any> | undefined;
  conversionRateData$: Observable<any> | undefined;
  clicks!: number[];
  labels!: string[];
  conversionRate!: number[];

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private analytics: AnalyticsService) {}

  ngOnInit() {
    this.sellerName = 'Amazon';
    this.analytics.getAnalyticsData(this.sellerName).subscribe(data => {
      this.productsClicked = data.product_clicks;
      this.websiteClicks = data.link_clicks;
    });
    this.analytics.getAllProducts(this.sellerName).subscribe(data => {
      this.productClicksData$ = of(data);
      this.productClicksData$.subscribe(data => {
        this.clicks = data.map((item: { [x: string]: any }) => item['clicks']);
        this.labels = data.map(
          (item: { [x: string]: any }) => item['product_name']
        );
        this.createProductClicksChart();
      });
    });

    this.analytics.getConversionRate(this.sellerName).subscribe(data => {
      this.conversionRateData$ = of(data);
      this.conversionRateData$.subscribe(data => {
        this.conversionRate = data.map(
          (item: { [x: string]: any }) => item['conversion_rate']
        );
      });

      this.createProductPerformanceChart();
    });

    // // Dummy data for demonstration
    // this.productsClicked = 100;
    // this.websiteClicks = 50;
    // this.favourited = 20;

    Chart.register(...registerables);
  }

  createProductClicksChart() {

    const productClicksCanvas = document.getElementById(
      'product-clicks-chart'
    ) as HTMLCanvasElement;


    const productClicksChart = new Chart(productClicksCanvas, {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: 'Product Clicks',
            data: this.clicks,
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 10,
            },
          },
        },
      },
    });
  }

  createProductPerformanceChart() {

    const productPerformanceCanvas = document.getElementById(
      'product-performance-chart'
    ) as HTMLCanvasElement;

    const productPerformanceChart = new Chart(productPerformanceCanvas, {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: 'Product Performance',
            data: this.conversionRate,
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 10,
            },
          },
        },
      },
    });
  }
}
