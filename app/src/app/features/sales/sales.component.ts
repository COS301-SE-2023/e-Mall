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
  topProducts$: Observable<any> | undefined;
  productClicksData$: Observable<any> | undefined;
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
  productNames!: string[];
  isChecked!: boolean;
  objCount=0
  productData: ProductData = {
  };
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(
    private analytics: AnalyticsService,
    private profileFacade: ProfileFacade
  ) { }

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
    this.analytics.getAnalyticsData(this.sellerName).subscribe(data => {
      this.productsClicked = data.product_clicks;
      this.websiteClicks = data.link_clicks;
      this.favourited = data.favourites;
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
        console.log(this.table_product_clicks);
        console.log(this.table_favourites);
        console.log(this.table_link_clicks);
        console.log(this.table_labels);
        //this.createProductClicksChart();

        this.table_labels.forEach(label => {
          this.getSelectedProductData(label);
        });
      });
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
        console.log(this.categories);
        console.log(this.categoryPercentage);
      });
      this.createCategoryPercentageChart();
    });
    Chart.register(...registerables);
  }

  /*createProductClicksChart() {
    const productClicksCanvas = document.getElementById(
      'product-clicks-chart'
    ) as HTMLCanvasElement;

    this.productClicksChart = new Chart(productClicksCanvas, {
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
            borderRadius: 5,
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Product Clicks',
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              callback: (value: string | number) => {
                const stringValue = this.labels[Number(value)].toString();
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
  }*/
  // Modify your data to fit the format required by the line chart

  createProductClicksChart() {
    const productClicksCanvas = document.getElementById(
      'product-clicks-chart'
    ) as HTMLCanvasElement;
    
    // Get the product names and months
    if (this.productClicksChart) {
      this.objCount=0;
      this.productClicksChart.destroy(); // Destroy the existing chart
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

  /*getSelectedProductData(product_name: string, event: any) {
    this.isChecked = event.detail.checked;
    if (this.isChecked) {
      if (this.productNames.indexOf(product_name) === -1) {
        this.productNames.push(product_name);
      }
    } else {
      const index = this.productNames.indexOf(product_name);
      if (index !== -1) {
        this.productNames.splice(index, 1);
      }
    }

    const data = {
      seller_name: this.sellerName,
      product_names: this.productNames,
    };

    const data1 = this.analytics.getSelectedProductData(data);
    console.log(data1);
    data1.subscribe(data => {
      console.log(data[product_name]);
      this.productData[product_name]=data[product_name];
      this.createProductClicksChart();
    });
console.log(this.productData);
  }*/

  getSelectedProductData(product_name: string) {
    this.productNames.push(product_name);
    const data = {
      seller_name: this.sellerName,
      product_names: this.productNames,
    };

    const data1 = this.analytics.getSelectedProductData(data);
    console.log(data1);
    data1.subscribe(data => {
      console.log(data[product_name]);
      this.productData[product_name] = data[product_name];
      this.createProductClicksChart();
    });
    console.log(this.productData);
  }
}
