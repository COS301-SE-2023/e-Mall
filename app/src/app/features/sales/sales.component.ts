import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Component({
  //selector: 'app-seller-dashboard',
  templateUrl: 'sales.component.html',
  styleUrls: ['sales.component.scss'],
})
export class SalesComponent implements OnInit {
  productsClicked =0;
  websiteClicks =0;
  favourited =0;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  ngOnInit() {
    // Dummy data for demonstration
    this.productsClicked = 100;
    this.websiteClicks = 50;
    this.favourited = 20;

    Chart.register(...registerables);

    this.createProductClicksChart();
    this.createProductPerformanceChart();
  }

  createProductClicksChart() {
    const productClicksCanvas = document.getElementById('product-clicks-chart') as HTMLCanvasElement;
    const productClicksChart = new Chart(productClicksCanvas, {
      type: 'bar',
      data: {
        labels: ['Product A', 'Product B', 'Product C', 'Product D'],
        datasets: [
          {
            label: 'Product Clicks',
            data: [50, 30, 20, 40],
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
    const productPerformanceCanvas = document.getElementById('product-performance-chart') as HTMLCanvasElement;
    const productPerformanceChart = new Chart(productPerformanceCanvas, {
      type: 'bar',
      data: {
        labels: ['Product A', 'Product B', 'Product C', 'Product D'],
        datasets: [
          {
            label: 'Product Performance',
            data: [80, 60, 40, 70],
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
