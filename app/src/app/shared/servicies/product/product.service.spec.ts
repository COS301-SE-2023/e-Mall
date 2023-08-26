/* eslint-disable @typescript-eslint/naming-convention */
import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { IProduct } from '@shared/models/product/product.interface';
import { IProductSeller } from '@shared/models/product/product-seller.interface';

describe('ProductService', () => {
  let productService: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });

    productService = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(productService).toBeTruthy();
  });

  it('should get product data by id', () => {
    const productId = 1;
    const mockProduct: IProduct = {
      id: 1,
      min_price_img_array: ['image1.jpg', 'image2.jpg'],
      name: 'Product 1',
      description: 'Description 1',
      brand: 'Brand 1',
      category: 'electronics',
      min_price: 10,
      min_price_seller_id: 'seller1',
      min_price_seller_product_url: 'seller1.com/product1',
      min_price_seller_business_name: 'Seller 1',
      min_price_in_stock: true,
      min_price_discount: 5,
      min_price_discount_rate: 0.5,
      min_price_original_price: 20,
      created_at: '2023-06-01',
      updated_at: '2023-06-02',
    };

    productService.getProductData(productId).subscribe((product: IProduct) => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(`${productService['apiUrl']}products/frontend?prod_id=${productId}`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockProduct);
  });

  it('should get a list of sellers for a product', () => {
    const productId = 1;
    const inStock = 'true';
    const mockSellers: IProductSeller[] = [
      { id: 1, product: 'Product1', seller: 'Seller1' },
      { id: 2, product: 'Product2', seller: 'Seller2' },
     
    ];
    productService.getSellerList(productId, inStock).subscribe((sellers: IProductSeller[]) => {
      expect(sellers).toEqual(mockSellers);
    });

    const req = httpMock.expectOne(`${productService['apiUrl']}productseller/backend?prod_id=${productId}&filter_in_stock=true`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockSellers);
  });

 

  it('should get products "For You"', () => {
    const mockProducts: IProduct[] = [
      {
        id: 1,
        min_price_img_array: ['image1.jpg', 'image2.jpg'],
        name: 'Product 1',
        description: 'Description 1',
        brand: 'Brand 1',
        category: 'electronics',
        min_price: 10,
        min_price_seller_id: 'seller1',
        min_price_seller_product_url: 'seller1.com/product1',
        min_price_seller_business_name: 'Seller 1',
        min_price_in_stock: true,
        min_price_discount: 5,
        min_price_discount_rate: 0.5,
        min_price_original_price: 20,
        created_at: '2023-06-01',
        updated_at: '2023-06-02',
      },
      {
        id: 2,
        min_price_img_array: ['image1.jpg', 'image2.jpg'],
        name: 'Product 2',
        description: 'Description 2',
        brand: 'Brand 2',
        category: 'electronics',
        min_price: 10,
        min_price_seller_id: 'seller2',
        min_price_seller_product_url: 'seller2.com/product2',
        min_price_seller_business_name: 'Seller 2',
        min_price_in_stock: true,
        min_price_discount: 5,
        min_price_discount_rate: 0.5,
        min_price_original_price: 20,
        created_at: '2023-06-01',
        updated_at: '2023-06-02',
      },
    ];

    productService.getForYouProducts().subscribe((products: IProduct[]) => {
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne(`${productService['apiUrl']}products/test?search=x`);
    expect(req.request.method).toEqual('GET');
    req.flush({ data: mockProducts });
  });

  it('should search for products with a search query', () => {
    const searchQuery = 'mock';
    const mockProducts: IProduct[] = [
      {
        id: 1,
        min_price_img_array: ['image1.jpg', 'image2.jpg'],
        name: 'Product 1',
        description: 'Description 1',
        brand: 'Brand 1',
        category: 'electronics',
        min_price: 10,
        min_price_seller_id: 'seller1',
        min_price_seller_product_url: 'seller1.com/product1',
        min_price_seller_business_name: 'Seller 1',
        min_price_in_stock: true,
        min_price_discount: 5,
        min_price_discount_rate: 0.5,
        min_price_original_price: 20,
        created_at: '2023-06-01',
        updated_at: '2023-06-02',
      },
      {
        id: 2,
        min_price_img_array: ['image1.jpg', 'image2.jpg'],
        name: 'Product 2',
        description: 'Description 2',
        brand: 'Brand 2',
        category: 'electronics',
        min_price: 10,
        min_price_seller_id: 'seller2',
        min_price_seller_product_url: 'seller2.com/product2',
        min_price_seller_business_name: 'Seller 2',
        min_price_in_stock: true,
        min_price_discount: 5,
        min_price_discount_rate: 0.5,
        min_price_original_price: 20,
        created_at: '2023-06-01',
        updated_at: '2023-06-02',
      },
    ];

    productService.searchProducts(searchQuery).subscribe(result => {
      expect(result.products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne(`${productService['apiUrl']}products/test?search=${searchQuery}`);
    expect(req.request.method).toEqual('GET');
    req.flush({ data: mockProducts });
  });

  it('should get products based on category', () => {
    const category = 'electronics';
    const mockProducts: IProduct[] = [
      {
        id: 1,
        min_price_img_array: ['image1.jpg', 'image2.jpg'],
        name: 'Product 1',
        description: 'Description 1',
        brand: 'Brand 1',
        category: 'electronics',
        min_price: 10,
        min_price_seller_id: 'seller1',
        min_price_seller_product_url: 'seller1.com/product1',
        min_price_seller_business_name: 'Seller 1',
        min_price_in_stock: true,
        min_price_discount: 5,
        min_price_discount_rate: 0.5,
        min_price_original_price: 20,
        created_at: '2023-06-01',
        updated_at: '2023-06-02',
      },
      {
        id: 2,
        min_price_img_array: ['image1.jpg', 'image2.jpg'],
        name: 'Product 2',
        description: 'Description 2',
        brand: 'Brand 2',
        category: 'electronics',
        min_price: 10,
        min_price_seller_id: 'seller2',
        min_price_seller_product_url: 'seller2.com/product2',
        min_price_seller_business_name: 'Seller 2',
        min_price_in_stock: true,
        min_price_discount: 5,
        min_price_discount_rate: 0.5,
        min_price_original_price: 20,
        created_at: '2023-06-01',
        updated_at: '2023-06-02',
      },
    ];

    productService.getCategoryProducts(category).subscribe((products: IProduct[]) => {
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne(`${productService['apiUrl']}products/backend/?filter_category=${category}`);
    expect(req.request.method).toEqual('GET');
    req.flush({ data: mockProducts });
  });
});
