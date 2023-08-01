 /* eslint-disable @typescript-eslint/naming-convention */
//search bar integration test
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchBarComponent } from '@shared/components/search-bar/search-bar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { IProduct } from '@shared/models/product/product.interface';
import { Router } from '@angular/router';
describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchBarComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        IonicModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should initialize searchInputController with an empty string', () => {
    expect(component.searchInputController.value).toEqual('');
  });

  it('should set placeHolder value correctly', () => {
    expect(component.placeHolder).toEqual('What are you looking for?');
  });

  it('should call search method when Enter key is pressed', () => {
    spyOn(component, 'search');
    const event = { code: 'Enter' };
    component.keyDownFunction(event);
    expect(component.search).toHaveBeenCalled();
  });

  it('should call search method when search icon is clicked', () => {
    spyOn(component, 'search');
    component.searchInputController.setValue('example');
    component.searchIconFunction();
    expect(component.search).toHaveBeenCalled();
  });

  
  it('should navigate to search results page on search method call', () => {
   spyOn(router, 'navigate');
    component.searchInputController.setValue('Test Search');
    component.search();
    expect(router.navigate).toHaveBeenCalledWith(['/search-results'], {
      queryParams: { search: 'Test Search' },
    });
  });

  it('should generate random products', () => {
    const products: IProduct[] = component.generateRandomProducts();
    expect(products).toBeTruthy();
    expect(products.length).toBe(3);
  });

  it('should get suggestions and return an observable of IProduct[]', () => {
    spyOn(component, 'generateRandomProducts').and.returnValue([
      {
        id: 1,
        min_price_img_array: ['img1', 'img2'],
        name: 'Product 1',
        brand: 'Brand 1',
        category: 'Category 1',
        min_price: 10,
      },
    ]);

    const suggestions$ = component.getSuggestion();
    suggestions$.subscribe((suggestions) => {
      expect(suggestions).toBeTruthy();
      expect(suggestions.length).toBe(1);
    });
  });
});
