import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { HttpClient } from '@angular/common/http';
interface Product {
  img: string;
  name: string;
  price: number;
}
import { AuthService } from '@app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  products: Product[] | undefined;
  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.fetchProducts();
  }

  fetchProducts() {
    this.http.get<Product[]>('/api/products/frontend').subscribe(
      response => {
        this.products = response;
      },
      error => {
        console.error('Error fetching products:', error);
      }
    );
  }

  search() {
    this.router.navigate(['/construction']);
    /* isAuthenticated = false;
  // isAuthenticated$;
  constructor(private authService: AuthService, private router: Router) {
    // this.isAuthenticated$ = this.authService.isAuthenticated();
    // this.isAuthenticated$.subscribe(val => console.log('Home [Auth]: ', val));
    // this.authService.isAuthenticated().subscribe(val => {
    //   this.isAuthenticated = val;
    // });
  }
  ngOnInit(): void {
    this.authService.isAuthenticated().subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
      console.log('Home [Auth]: ', isAuthenticated);
    });
  }
  public signOut(): void {
    this.router.navigate(['sign-out']);
  }*/
  }
}
